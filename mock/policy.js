import Mock from 'mockjs'

const data = Mock.mock({
  'items|10': [{
    id: '@id',
    productNames:'产品1,产品2',
    productId:[11,13,15],
    code: '@sentence(1, 2)',
    name:'决策流名称',
    'versionCount|1':[3,1,6,5],
    targetCode:'决策流标识',
    usingVersion: 'v1.0.1', 
    'status|1': ['done', 'todo'], 
  }]
})


const productData = Mock.mock({
  'items|30': [{
    id: '@id',
    name1:'产品名称1',
    'name2|+1': 1,
    'productCode|+1': 10,
    expression:'渠道编码',
  }]
});


const approveData = Mock.mock({
  'items|8': [{
    id: '@id',
    submitTime:'@datetime',
    auditTime:'@datetime',
    code:'1.2.1',
    'auditState|1':['unaudit', 'auditing', 'refuse','audited'],
  }]
});

const versionData = Mock.mock({
  'items|8': [{
    id: '@id',
    'code|+1':1255,
    updateTime:'@datetime',
    desc:'@sentence(3, 6)',
    expression:'每天 12:13:14',
    'versionState|1':[0,1],
    'auditState|1':['unaudit', 'auditing', 'refuse','audited'],
    'isSystemUse|1':[0,1],
  }]
});

export default [
  {
    url: '/vue-admin-template/policy/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          rows: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/policy/product-list',
    type: 'get',
    response: config => {
      const items = productData.items
      return {
        code: 20000,
        data: {
          total: items.length,
          rows: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/policy/approve-list',
    type: 'get',
    response: config => {
      const items = approveData.items
      return {
        code: 20000,
        data: {
          total: items.length,
          rows: items
        }
      }
    }
  },
  {
    url: '/version/list',
    type: 'get',
    response: config => {
      const items = versionData.items
      return {
        code: 20000,
        data: {
          total: items.length,
          rows: items
        }
      }
    }
  },

]
