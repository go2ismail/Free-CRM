const App = {
    setup() {
        const state = Vue.reactive({
            isSubmitting: false,
            selectedTable: '',
            tables: [],
            file: null,
            separator: ',',
            columnMappings: []
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

        const handleFileUpload = (event) => {
            state.file = event.target.files[0];
        };

        const addColumn = () => {
            state.columnMappings.push({ csvColumn: '', tableColumn: '' });
        };

        const removeColumn = (index) => {
            state.columnMappings.splice(index, 1);
        };

        const handleSubmit = async () => {
            if (!state.file || !state.selectedTable ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Champs manquants',
                    text: 'Veuillez sélectionner un fichier, une table, un séparateur et au moins une correspondance de colonne.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Convertir state.columnMappings en un dictionnaire pour correspondre à l'attente du backend
            const columnMappingsDict = {};
            state.columnMappings.forEach(mapping => {
                if (mapping.csvColumn && mapping.tableColumn) {
                    columnMappingsDict[mapping.csvColumn] = mapping.tableColumn;
                }
            });

            const formData = new FormData();
            formData.append("file", state.file);
            formData.append("entityName", state.selectedTable);
            formData.append("separator", state.separator);
            formData.append("columnMappings", JSON.stringify(columnMappingsDict));

            try {
                state.isSubmitting = true;

                const response = await AxiosManager.post('/Csv/Import', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Import réussi',
                        text: response.data.content?.message || 'Le fichier a été importé avec succès.',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    setTimeout(() => window.location.reload(), 2000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Échec de l\'import',
                        text: response.data.message || 'Une erreur est survenue.',
                        confirmButtonText: 'Réessayer'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error.response?.data?.message || 'Impossible de terminer l\'importation.',
                    confirmButtonText: 'OK'
                });
            } finally {
                state.isSubmitting = false;
            }
        };


        fetchTables();

        return {
            state,
            handleFileUpload,
            addColumn,
            removeColumn,
            handleSubmit
        };
    }
};

Vue.createApp(App).mount('#app');
