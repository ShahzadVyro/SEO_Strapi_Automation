const axios = require('axios');
const FormData = require('form-data');
const PublishLog = require('../models/PublishLog');

const strapiBase = () => process.env.STRAPI_BASE_URL || 'https://imagine-blog.vyro.ai/api';
const strapiToken = () => process.env.STRAPI_API_TOKEN;

function strapiClient() {
  return axios.create({
    baseURL: strapiBase(),
    headers: { Authorization: `Bearer ${strapiToken()}` },
  });
}

// Paginate all records from a Strapi endpoint
async function fetchAll(client, endpoint, fields = 'id,name') {
  let page = 1;
  const pageSize = 100;
  let allData = [];
  while (true) {
    const res = await client.get(`/${endpoint}`, {
      params: { 'pagination[page]': page, 'pagination[pageSize]': pageSize, fields },
    });
    const items = res.data?.data || [];
    allData = allData.concat(items);
    const total = res.data?.meta?.pagination?.total ?? items.length;
    if (allData.length >= total || items.length === 0) break;
    page++;
  }
  return allData;
}

// GET /api/strapi/relations
async function getRelations(req, res) {
  const client = strapiClient();
  const [authors, reviewers, organizations, blogs, studios, usecaseCategories] = await Promise.all([
    fetchAll(client, 'authors', 'id,name'),
    fetchAll(client, 'reviewers', 'id,name'),
    fetchAll(client, 'organizations', 'id,name'),
    fetchAll(client, 'imagine-webs', 'id,title,slug'),
    fetchAll(client, 'imagine-studios', 'id,name'),
    fetchAll(client, 'usecase-categories', 'id,name'),
  ]);

  const toOptions = (items, labelKey = 'name') =>
    items.map(i => ({ id: i.id, label: i.attributes?.[labelKey] || i.attributes?.title || String(i.id) }));

  res.json({
    authors: toOptions(authors),
    reviewers: toOptions(reviewers),
    organizations: toOptions(organizations),
    blogs: toOptions(blogs, 'title'),
    studios: toOptions(studios),
    usecaseCategories: toOptions(usecaseCategories),
  });
}

// POST /api/strapi/upload
async function uploadMedia(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  const form = new FormData();
  form.append('files', req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  const uploadRes = await axios.post(`${strapiBase()}/upload`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${strapiToken()}`,
    },
  });

  const uploaded = uploadRes.data[0];
  res.json({ id: uploaded.id, url: uploaded.url, name: uploaded.name, mime: uploaded.mime });
}

// POST /api/strapi/publish
async function publishCluster(req, res) {
  const { template, fields, publishedBy = 'unknown' } = req.body;
  if (!template || !fields) return res.status(400).json({ error: 'template and fields are required' });

  const payload = buildPayload(template, fields);

  let strapiRes;
  try {
    strapiRes = await strapiClient().post('/cluster-pages', { data: payload });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    await PublishLog.create({
      slug: fields.slug || 'unknown',
      template,
      publishedBy,
      payload,
      status: 'failed',
      errorMessage: errMsg,
    }).catch(() => {});
    return res.status(502).json({ error: 'Strapi publish failed', detail: errMsg });
  }

  const strapiId = strapiRes.data?.data?.id;
  await PublishLog.create({
    slug: fields.slug || 'unknown',
    template,
    publishedBy,
    strapiId,
    payload,
    strapiResponse: strapiRes.data,
    status: 'success',
  }).catch(() => {});

  res.json({ success: true, strapiId, slug: fields.slug });
}

// GET /api/strapi/cluster-pages
async function getClusterPages(req, res) {
  const client = strapiClient();
  const { page = 1, pageSize = 25 } = req.query;
  const response = await client.get('/cluster-pages', {
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      fields: 'id,slug,publishedAt,createdAt',
    },
  });
  res.json(response.data);
}

// Build Strapi payload per template type
function buildPayload(template, fields) {
  const base = {
    slug: fields.slug,
    seo: {
      metaTitle: fields['Meta Title'] || fields.metaTitle,
      metaDescription: fields['Meta Description'] || fields.metaDescription,
    },
    publishedAt: new Date().toISOString(),
  };

  if (template === 'template-7' || template === 'video-template-1') {
    const templateKey = template === 'template-7' ? 'templates' : 'video-templates';
    const componentName = template === 'template-7' ? 'template-7' : 'video-template-1';
    return {
      ...base,
      template: {
        __component: `${templateKey}.${componentName}`,
        heroHeading: fields['Hero Heading'] || fields.heroHeading,
        heroSubheading: fields['Hero Subheading'] || fields.heroSubheading,
        heroImage: fields.heroImageId ? { id: fields.heroImageId } : undefined,
        heroVideo: fields.heroVideoId ? { id: fields.heroVideoId } : undefined,
      },
      author: fields.authorId ? { id: fields.authorId } : undefined,
      reviewer: fields.reviewerId ? { id: fields.reviewerId } : undefined,
      imagine_web: fields.blogId ? { id: fields.blogId } : undefined,
      imagine_studio: fields.studioId ? { id: fields.studioId } : undefined,
    };
  }

  return base;
}

module.exports = { getRelations, uploadMedia, publishCluster, getClusterPages };
