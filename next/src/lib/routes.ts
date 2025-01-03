const routes = {
    dashboard: '/dashboard',
    chat: '/chat',
    createJobs: '/postings/forge',
    job: (id: string) => `postings/${id}`,
    application: (id: string) => `apply/${id}`,
    onboarding: {
        resume: '/onboarding/resume',
        validation: '/onboarding/validation',
        final: '/onboarding/final'
    },
    update: {
        resume: '/update/resume',
        validation: '/update/validation',
        final: '/update/final'
    },
    login: 'auth/login'
}

export default routes;