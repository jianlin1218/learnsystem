import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    'targetType|1':[0,1],
    targetName:'指标名称',
    targetCode:'@sentence(1, 2)',
    targetDesc: '@sentence(20, 30)',
    tags:'标签1,标签2',
    updateTime: '@datetime',
    targetExpression:'@sentence(10, 20)',
    'auditState|1': ['unaudit', 'auditing', 'refuse','audited'], 
  }]
})

export default [
  {
    url: '/vue-admin-template/exponent/list',
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
  }
]
