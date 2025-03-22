const App = {
    setup() {
        const state = Vue.reactive({
            message: "Hello, this is the Manage Data page!",
            isSubmittingC: false,
            isSubmittingR: false,
            isSubmittingUP: false,
            dataStoquer: [],
       
            uploadedFile: null,
            errors: {
                uploadedFile: ''
            }
        });

        const Clear = async () => {
            try {
                const response = await AxiosManager.delete('/DatabaseCleaner/clean-all');
                return response;
            } catch (error) {
                throw error;
            }
        };

        const handleClear = async () => {
            try {
                state.isSubmittingC = true;
                await new Promise(resolve => setTimeout(resolve, 300));

                const response = await Clear();

                StorageManager.clearStorage();
                Swal.fire({
                    icon: 'success',
                    title: 'Clear Successful',
                    text: 'You are being redirected...',
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred',
                    text: error.response?.data?.message || 'Please try again.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmittingC = false;
            }
        };

        const Reset = async () => {
            try {
                const response = await AxiosManager.post('/DatabaseCleaner/reset-demo-data');
                return response;
            } catch (error) {
                throw error;
            }
        };

        const handleReset = async () => {
            try {
                state.isSubmittingR = true;
                await new Promise(resolve => setTimeout(resolve, 300));

                const response = await Reset();

                StorageManager.clearStorage();
                Swal.fire({
                    icon: 'success',
                    title: 'Reset Successful',
                    text: 'You are being redirected...',
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred',
                    text: error.response?.data?.message || 'Please try again.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmittingR = false;
            }
        };


        const handleFileChange = (event) => {
            state.uploadedFile = event.target.files[0];
        };

        const handleUpload = async () => {
            if (!state.uploadedFile) {
                state.errors.uploadedFile = 'File is required.';
                return;
            }

            const formData = new FormData();
            formData.append('file', state.uploadedFile);

            try {
                state.isSubmittingUP = true;
                await new Promise(resolve => setTimeout(resolve, 300));

                const response = await AxiosManager.post('/ImportCsv/UploadCsv', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Log the response to check its structure
                console.log('Response:', response);

                if (response.data && response.data.content) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Upload Successful',
                        text: 'File has been uploaded successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    state.dataStoquer.push({
                        message: response.data.content.message, 
                        data: response.data.content.data 
                    });

                    console.log('stoquer', state.dataStoquer)

                    setTimeout(() => {
                        window.location.href = '/Data/manage';
                    }, 2000);
                } else {
                    throw new Error('Invalid response structure');
                }

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred',
                    text: error.response?.data?.message || 'Please try again.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmittingUP = false;
            }
        };

        return {
            state,
            handleClear,
            handleReset,
            handleFileChange,
            handleUpload
        };
    }
};

Vue.createApp(App).mount('#app');
