import request from '@/utils/request' 
import qs from 'query-string'

export function login(data) {
  const params = qs.stringify(data);
  return request({
    url: `/v1/basic/login?${params}`,
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/gms/v1/basic/logout',
    method: 'post'
  })
}

export function getInfo(token) {
  return request({
    url: '/v1/sys/users/getLoginUser',
    method: 'get',
    // params: { token }
  })
}


//----------------用户------------------

// 用户列表
export function listUser(data) {
  const params = qs.stringify(data);
  return request({
    url: '/gsm/v1/sys/users/listUsers?'+params,
    method: 'get',
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/gsm/v1/sys/users/addUser',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/gsm/v1/sys/users/delete?id='+id,
    method: 'get',
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: '/gsm/v1/sys/users/managerUpdateInfo',
    method: 'post',
    data
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