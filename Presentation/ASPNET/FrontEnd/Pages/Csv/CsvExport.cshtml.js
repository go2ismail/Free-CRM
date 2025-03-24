const App = {
    setup() {
        const state = Vue.reactive({
            isSubmitting: false,
            selectedTable: '',
            tables: [],
            separator: ',',
            selectedFolder: '',
            exportMessage: ''
        });

        const fetchTables = async () => {
            try {
                const response = await AxiosManager.get('/Csv/Entities');
                if (typeof response.data.content.entities === 'string') {
                    state.tables = response.data.content.entities.split(',');
                } else {
                    state.tables = response.data.content.entities || [];
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des tables:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible de charger la liste des tables.',
                    confirmButtonText: 'OK'
                });
            }
        };

        const handleFolderSelection = (event) => {
            if (event.target.files.length > 0) {
                const firstFilePath = event.target.files[0].webkitRelativePath;
                const folderPath = firstFilePath.substring(0, firstFilePath.lastIndexOf('/'));
                state.selectedFolder = folderPath;
            } else {
                state.selectedFolder = '';
            }
        };

        const handleExport = async () => {
            if (!state.selectedTable) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Champs manquants',
                    text: 'Veuillez sélectionner une table et un dossier pour l\'exportation.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            const filePath = `${state.selectedTable}.csv`;
            const exportRequest = {
                entityName: state.selectedTable,
                separator: state.separator,
                filePath: filePath
            };

            try {
                state.isSubmitting = true;

                const response = await AxiosManager.get('/Csv/Export', {
                    headers: {
                        'entityName': state.selectedTable,
                        'separator': state.separator,
                        'filePath': filePath
                    }
                });

                if (response.data.code === 200) {
                    state.exportMessage = `CSV export completed successfully. File saved at ${response.data.content.message}`;
                    Swal.fire({
                        icon: 'success',
                        title: 'Export réussi',
                        text: response.data.content.message,
                        timer: 3000,
                        showConfirmButton: false
                    });
                } else {
                    state.exportMessage = 'Une erreur est survenue lors de l\'exportation.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: response.data.message || 'Une erreur est survenue.',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                state.exportMessage = 'Erreur inconnue lors de l\'exportation.';
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error.response?.data?.message || 'Impossible de terminer l\'export.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmitting = false;
            }
        };

        // Charger les tables disponibles
        fetchTables();

        return {
            state,
            handleExport,
            handleFolderSelection
        };
    }
};

Vue.createApp(App).mount('#app');
