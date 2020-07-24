import request from '@/utils/request' 
import qs from 'query-string'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}


//---------------- 角色 ----------------

// 角色列表
export function listRoles(data) {
  const params = qs.stringify(data);
  return request({
    url: '/gsm/v1/sys/roles/listRoles?'+params,
    method: 'get',
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/gsm/v1/sys/roles/addRole',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: '/gsm/v1/sys/roles/delete?id='+id,
    method: 'get',
  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: '/gsm/v1/sys/roles/updateRole',
    method: 'post',
    data
  })
}

//---------------- 部门 ----------------

// 部门列表
export function listDept(data) {
  const params = qs.stringify(data);
  
  return request({
    url: '/gsm/v1/sys/depts/listDeptsTree?'+params,
    method: 'get',
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/gsm/v1/sys/depts/addDept',
    method: 'post',
    data
  })
}

// 删除部门
export function deleteDept(id) {
  return request({
    url: '/gsm/v1/sys/depts/delete?id='+id,
    method: 'get',
  })
}

// 更新部门
export function updateDept(data) {
  return request({
    url: '/gsm/v1/sys/depts/updateDept',
    method: 'post',
    data
  })
}