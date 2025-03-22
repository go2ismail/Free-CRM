const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            mainTitle: null,
            importTitle: null,
            exportTitle: null,
            name: '',
            errors: {
                name: '',
            },
            changeAvatarTitle: 'Import Table',
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const fileUploadRef = Vue.ref(null);
        const changeAvatarModalRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);

        const resetFormState = () => {
            state.name = '';
        };

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Table/GetTableList');
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (name) => {
                try {
                    const response = await AxiosManager.post('/Table/DeleteTable', { name });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            uploadFile: async (file, tableName) => { 
                const formData = new FormData();
                formData.append('file', file);
                formData.append('tableName', tableName); 
                try {
                    const response = await AxiosManager.post('/Table/ImportTable', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            importTable: async (tableName, file) => {
                try {
                    const formData = new FormData();
                    formData.append("name", tableName);
                    formData.append("file", file);

                    const response = await AxiosManager.post('/Table/ImportTable', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "Import Successful",
                            text: `Table ${tableName} imported successfully! ${response.data.content.insertedCount} rows inserted.`,
                            timer: 3000,
                            showConfirmButton: false
                        });
                    }
                    return response;
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: error.response?.data?.message || "Import Failed",
                        text: error.response?.data?.errorDetails || "An error occurred during import."
                    });
                    throw error;
                }
            },
            exportTable: async (Name) => {
                try {
                    const response = await AxiosManager.post('/Table/ExportTable', { Name });
                    
                    if (response.status === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "Export Successful",
                            text: `Table ${Name} exported successfully!`,
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else {
                        throw new Error("No data found in the table.");
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: error.data?.message || "Export Failed",
                        text: error.response?.data?.errorDetails || "An error occurred during export."
                    });
                }
            },

        };

        const methods = {
            populateMainData: async () => {
                try {
                    const response = await services.getMainData();
                    state.mainData = response?.data?.content?.data.map(item => ({ ...item }));
                    if (!mainGrid.obj) {
                        await mainGrid.create(state.mainData);
                    } else {
                        mainGrid.refresh();
                    }
                } catch (error) {
                    console.error("Error populating main data:", error);
                    state.mainData = [];
                }
            }
        };


        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 300));

                    let response;
                    if (state.deleteMode) {
                        response = await services.deleteMainData(state.name);
                    } else {
                        response = await services.getMainData();
                    }

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (state.deleteMode) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Delete Successful',
                                text: 'Operation completed',
                                timer: 2000,
                                showConfirmButton: false
                            });
                            resetFormState();
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Data Fetched',
                                text: 'Data updated successfully',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: state.deleteMode ? 'Delete Failed' : 'Operation Failed',
                            text: response.data.message ?? 'Please check your data.',
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
            },
            handleFileUpload: async (file) => {
                try {
                    const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                    const tableName = selectedRecord.name;

                    if (!file) {
                        Swal.fire({
                            icon: "warning",
                            title: "No File Selected",
                            text: "Please select a CSV file before importing."
                        });
                        return;
                    }

                    const response = await services.importTable(tableName, file);

                    if (response.status === 200) {
                        changeAvatarModal.obj.hide();
                        await methods.populateMainData();
                    }
                } catch (error) {
                    console.error("Import error:", error);
                }
            },
        };

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
                    height: '240px',
                    dataSource: dataSource,
                    allowFiltering: true,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: true,
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: true,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'name', direction: 'Ascending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        { field: 'name',  headerText: 'Name',isPrimaryKey: true, visible: true, width: 200, minWidth: 200 },
                    ],
                    toolbar: [
                        'Search',
                        { type: 'Separator' },
                        { text: 'Import', tooltipText: 'Import', prefixIcon: 'e-download', id: 'ImportCustom' },
                        { text: 'Export', tooltipText: 'Export', prefixIcon: 'e-export', id: 'ExportCustom' },
                        { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['ImportCustom', 'ExportCustom', 'DeleteCustom'], false);
                        mainGrid.obj.autoFitColumns(['name']);
                    },
                    rowSelected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['ImportCustom', 'ExportCustom', 'DeleteCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['ImportCustom', 'ExportCustom', 'DeleteCustom'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['ImportCustom', 'ExportCustom', 'DeleteCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['ImportCustom', 'ExportCustom', 'DeleteCustom'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (mainGrid.obj.getSelectedRecords().length) {
                            mainGrid.obj.clearSelection();
                        }
                    },
                    toolbarClick: async (args) => {
                        if (args.item.id === 'MainGrid_excelexport') {
                            mainGrid.obj.excelExport();
                        }

                        if (args.item.id === 'ImportCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.userId = selectedRecord.id ?? '';
                                changeAvatarModal.obj.show();
                            }
                            // Si tu as un modal, affiche-le ici
                        }

                        if (args.item.id === 'ExportCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                const tableName = selectedRecord.name ?? '';

                                Swal.fire({
                                    title: "Export Table",
                                    text: `Are you sure you want to export "${tableName}"?`,
                                    icon: "question",
                                    showCancelButton: true,
                                    confirmButtonText: "Export",
                                    cancelButtonText: "Cancel"
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        await services.exportTable(tableName);
                                    }
                                });
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Table?';
                                state.name = selectedRecord.name ?? '';
                                mainModal.obj.show();
                            }
                        }
                    }
                });

                mainGrid.obj.appendTo(mainGridRef.value);
            },
            refresh: () => {
                mainGrid.obj.setProperties({ dataSource: state.mainData });
            }
        };
        
        Vue.onMounted(async () => {
            Dropzone.autoDiscover = false;
            try {
                await SecurityManager.authorizePage(['Profiles']);
                await SecurityManager.validateToken();
                await methods.populateMainData();
                
                mainModal.create();
                changeAvatarModal.create();

                mainModalRef.value?.addEventListener('hidden.bs.modal', () => {
                    resetFormState();
                });
                
                initDropzone();
                
                

            } catch (e) {
                console.error('page init error:', e);
            } finally {

            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', resetFormState);
        });
        
        let dropzoneInitialized = false;
        const initDropzone = () => {
            if (!dropzoneInitialized && fileUploadRef.value) {
                dropzoneInitialized = true;
                const dropzoneInstance = new Dropzone(fileUploadRef.value, {
                    url: "#",
                    paramName: "file",
                    maxFiles: 1,
                    maxFilesize: 5,
                    acceptedFiles: ".csv",
                    addRemoveLinks: true,
                    dictDefaultMessage: "Drop the CSV file here or click to select",
                    autoProcessQueue: false,
                    init: function () {
                        this.on("addedfile", async function (file) {
                            if (this.files.length > 1) this.removeFile(this.files[0]);
                            await handler.handleFileUpload(file);
                            this.removeAllFiles();
                        });
                    }
                });
            }
        };

        const mainModal = {
            obj: null,
            create: () => {
                mainModal.obj = new bootstrap.Modal(mainModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };

        const changeAvatarModal = {
            obj: null,
            create: () => {
                changeAvatarModal.obj = new bootstrap.Modal(changeAvatarModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };

        return {
            mainGridRef,
            state,
            mainModalRef,
            changeAvatarModalRef,
            fileUploadRef,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');
