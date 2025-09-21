const App = {
    setup() {
        const state = Vue.reactive({
            message: "Hello, this is the Manage Data page!",
            isSubmittingC: false,
            isSubmittingR: false,
            isSubmittingUP: false,
            dataStoquer: [],
       
            uploadedFile: null,
            uploadedCampFile: null,
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

        const handleFileChangeCamp = (event) => {
            state.uploadedCampFile = event.target.files[0];
        };

        const handleUpload = async () => {
            var separator = document.getElementById('fileSeparatorRef').value;
            var dateformat = document.getElementById('fileformatDateRef').value;
            console.log('separator', separator);
            console.log('dateformat', dateformat);
            if (!state.uploadedFile) {
                state.errors.uploadedFile = 'File is required.';
                return;
            }
            if (separator == "") {
                state.errors.uploadedFile = 'Separator is required.';
                return;
            }   
            if (dateformat == "") {
                state.errors.uploadedFile = 'Date format is required.';
                return;
            }

            const formData = new FormData();
            formData.append('fileCamp', state.uploadedCampFile);
            formData.append('fileRes', state.uploadedFile);
            formData.append('separator', separator);
            formData.append('dateFormat', dateformat);

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
                if (response.data.code === 407) {
                    Swal.fire({
                        icon: 'Error',
                        title: 'Upload Faild',
                        text: response.data.message ?? 'Please check your data.',
                        confirmButtonText: 'Try Again'
                    });

                } else if (response.data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Upload Successful',
                        text: 'File has been uploaded successfully. \n'+response.data.message,
                        timer: 2000,
                        showConfirmButton: false
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
            handleUpload,
            handleFileChangeCamp
        };
    }
};

Vue.createApp(App).mount('#app');
