export const state = {
  breadcrumbs: {},
}

export const mutations = {
  SET_BREADCRUMBS(state, data) {
    state.breadcrumbs = data
  },
}

export const actions = {
  setBreadcrumb({ commit, state }, data) {
    commit('SET_BREADCRUMBS', data)
  },
}

export default {
  state,
  mutations,
  actions,
  namespaced: true,
}
