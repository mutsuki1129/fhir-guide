import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/tutorial/:chapterId/:stepId',
      name: 'tutorial',
      component: () => import('@/views/TutorialView.vue')
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('@/views/EditorView.vue')
    },
    {
      path: '/api-tester',
      name: 'api-tester',
      component: () => import('@/views/ApiTesterView.vue')
    },
    {
      path: '/reference',
      name: 'reference',
      component: () => import('@/views/ReferenceView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
