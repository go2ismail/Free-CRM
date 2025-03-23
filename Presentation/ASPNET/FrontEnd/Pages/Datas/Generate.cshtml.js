const App = {
    setup() {
        // Initialisation des données réactives
        const state = Vue.reactive({
            isSubmitting: false,
            regenerateMessage: null
        });
 
        // Fonction pour régénérer les données
        const regenerateAllData = async () => {
            try {
                state.isSubmitting = true;
                const response = await AxiosManager.post('/DataGeneration/GenerateAllData', {});

                if (response?.data?.code === 200) { // Vérification sécurisée
                    state.regenerateMessage = response.data.content?.message || 'Data has been regenerated successfully.';
                    Swal.fire({
                        icon: 'success',
                        title: 'Data Generated Successfully',
                        text: state.regenerateMessage,
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Data Generation Failed',
                        text: response?.data?.message || 'Failed to regenerate data.',
                        confirmButtonText: 'Try Again'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred',
                    text: error?.response?.data?.message || 'Please try again.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmitting = false;
                state.regenerateMessage = null;
            }
        };

        return {
            state,
            regenerateAllData
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Vue.createApp(App).mount('#app');
});
