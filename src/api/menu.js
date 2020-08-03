import request from '@/utils/request' 
// import qs from 'query-string'


//---------------- 菜单 ----------------

// 菜单列表
export function menuTree() { 
  return request({
    url: '/gsm/v1/sys/menus/listMenusTree',
    method: 'get'
  })
} 

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/gsm/v1/sys/menus/addMenu',
    method: 'post',
    data
  })
}

// 删除菜单
export function delMenu(params) {
  return request({
    url: '/gsm/v1/sys/menus/delete',
    method:'get',
    params
  })
}

// 更新菜单
export function updateMenu(data) {
  console.log(data);
  return request({
    url: '/gsm/v1/sys/menus/updateMenu',
    method: 'post',
    data
  })
}
