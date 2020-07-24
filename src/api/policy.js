import request from '@/utils/request'
/* 
 *决策流管理
*/

// 获取列表
export function getList(params) {
  return request({
    url: '/vue-admin-template/policy/list',
    method: 'get',
    params
  })
}

// 产品列表 
export function getProductList(params) {
  return request({
    url: '/vue-admin-template/policy/product-list',
    method: 'get',
    params
  })
}


// 添加
export function createPolicy(params) {
  return request({
    url: '/vue-admin-template/policy/list',
    method: 'get',
    params
  })
}

// 编辑
export function editPolicy(params) {
  return request({
    url: '/vue-admin-template/policy/list',
    method: 'get',
    params
  })
}

// 删除
export function deletePolicy(params) {
  return request({
    url: '/vue-admin-template/policy/list',
    method: 'get',
    params
  })
}

// 跑批
export function runPolicy(params) {
  return request({
    url: '/vue-admin-template/policy/list',
    method: 'get',
    params
  })
}

// 审批记录
export function getApproveList(params) {
  return request({
    url: '/vue-admin-template/policy/approve-list',
    method: 'get',
    params
  })
}


/* 
* 决策流版本管理
*/
export function getVersionList(params) {
  return request({
    url: '/version/list',
    method: 'get',
    params
  })
}

