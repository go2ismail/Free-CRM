const App = {
    setup() {
        const state = Vue.reactive({
            isSubmitting: false,
        });

        const logout = async () => {
            try {
                const response = await AxiosManager.post('/Security/Logout', {
                    userId: StorageManager.getUserId()
                });
                return response;
            } catch (error) {
                throw error;
            }
        }

        const handleSubmit = async () => {

            try {
                state.isSubmitting = true;
                await new Promise(resolve => setTimeout(resolve, 300));

                const response = await logout();
                if (response.data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logout Successful',
                        text: 'You are being redirected...',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Logout Failed',
                        text: response.data.message ?? 'Logout Failed.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred',
                    text: error.response?.data?.message || 'Please try again.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } finally {
                state.isSubmitting = false;
                StorageManager.clearStorage();
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        };

        return {
            state,
            handleSubmit
        };
    }
};

Vue.createApp(App).mount('#app');

