const App = {
    setup() {
        const state = Vue.reactive({
            isSubmitting: false,
        });

        const reset = async () => {
            try {
                const response = await AxiosManager.post('/Data/ResetData', {});
                return response;
            } catch (error) {
                throw error;
            }
        };

        const handleSubmit = async () => {
            try {
                state.isSubmitting = true;
                await new Promise(resolve => setTimeout(resolve, 300));

                const response = await reset();

                if (response.data.code === 200) {
                    StorageManager.clearStorage();

                    // Afficher le message retourné par le backend
                    Swal.fire({
                        icon: 'success',
                        title: 'Reset Successful',
                        text: response.data.content?.message || 'Data has been reset successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        window.location.href = '/'; // Redirection après le succès
                    }, 2000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Reset Failed',
                        text: response.data.message ?? 'Reset Failed.',
                        confirmButtonText: 'Try Again'
                    });
                }

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred',
                    text: error.response?.data?.message || 'Please try again.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmitting = false;
            }
        };

        return {
            state,
            handleSubmit
        };
    }
};

Vue.createApp(App).mount('#app');
