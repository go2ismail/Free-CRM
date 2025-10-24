const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            salesTeamListLookupData: [],
            statusListLookupData: [],
            mainTitle: null,
            id: '',
            number: '',
            salesTeamId: null,
            projectDateStart: '',
            projectDateFinish: '',
            title: '',
            description: '',
            status: null,
            errors: {
                salesTeamId: '',
                projectDateStart: '',
                projectDateFinish: '',
                title: '',
                status: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const projectDateStartRef = Vue.ref(null);
        const projectDateFinishRef = Vue.ref(null);
        const titleRef = Vue.ref(null);
        const statusRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const salesTeamIdRef = Vue.ref(null);


        const validateForm = function () {
            state.errors.projectDateStart = '';
            state.errors.projectDateFinish = '';
            state.errors.title = '';
            state.errors.status = '';
            state.errors.salesTeamId = '';

            let isValid = true;

            if (!state.projectDateStart) {
                state.errors.projectDateStart = 'Start date is required.';
                isValid = false;
            }
            if (!state.projectDateFinish) {
                state.errors.projectDateFinish = 'Finish date is required.';
                isValid = false;
            }
            if (!state.title) {
                state.errors.title = 'Title is required.';
                isValid = false;
            }
            if (!state.status) {
                state.errors.status = 'Status is required.';
                isValid = false;
            }
            if (!state.salesTeamId) {
                state.errors.salesTeamId = 'Sales team is required.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.number = '';
            state.projectDateStart = '';
            state.projectDateFinish = '';
            state.title = '';
            state.salesTeamId = null;
            state.description = '';
            state.status = null;
            state.errors = {
                projectDateStart: '',
                projectDateFinish: '',
                title: '',
                salesTeamId: '',
                status: ''
            };
        };

        const projectDateStartPicker = {
            obj: null,
            create: () => {
                projectDateStartPicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'Select Date',
                    format: 'yyyy-MM-dd',
                    value: state.projectDateStart ? new Date(state.projectDateStart) : null,
                    change: (e) => {
                        state.projectDateStart = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                projectDateStartPicker.obj.appendTo(projectDateStartRef.value);
            },
            refresh: () => {
                if (projectDateStartPicker.obj) {
                    projectDateStartPicker.obj.value = state.projectDateStart ? new Date(state.projectDateStart) : null;
                }
            }
        };

        Vue.watch(
            () => state.projectDateStart,
            (newVal, oldVal) => {
                projectDateStartPicker.refresh();
                state.errors.projectDateStart = '';
            }
        );

        const projectDateFinishPicker = {
            obj: null,
            create: () => {
                projectDateFinishPicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'Select Date',
                    format: 'yyyy-MM-dd',
                    value: state.projectDateFinish ? new Date(state.projectDateFinish) : null,
                    change: (e) => {
                        state.projectDateFinish = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                projectDateFinishPicker.obj.appendTo(projectDateFinishRef.value);
            },
            refresh: () => {
                if (projectDateFinishPicker.obj) {
                    projectDateFinishPicker.obj.value = state.projectDateFinish ? new Date(state.projectDateFinish) : null;
                }
            }
        };

        Vue.watch(
            () => state.projectDateFinish,
            (newVal, oldVal) => {
                projectDateFinishPicker.refresh();
                state.errors.projectDateFinish = '';
            }
        );

        const numberText = {
            obj: null,
            create: () => {
                numberText.obj = new ej.inputs.TextBox({
                    placeholder: '[auto]',
                });
                numberText.obj.appendTo(numberRef.value);
            }
        };


        const statusListLookup = {
            obj: null,
            create: () => {
                if (state.statusListLookupData && Array.isArray(state.statusListLookupData)) {
                    statusListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.statusListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'Select Status',
                        allowFiltering: false,
                        change: (e) => {
                            state.status = e.value;
                        }
                    });
                    statusListLookup.obj.appendTo(statusRef.value);
                }
            },

            refresh: () => {
                if (statusListLookup.obj) {
                    statusListLookup.obj.value = state.status
                }
            },
        };

        Vue.watch(
            () => state.status,
            (newVal, oldVal) => {
                statusListLookup.refresh();
                state.errors.status = '';
            }
        );



        const salesTeamListLookup = {
            obj: null,
            create: () => {
                if (state.salesTeamListLookupData && Array.isArray(state.salesTeamListLookupData)) {
                    salesTeamListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.salesTeamListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'Select a Sales Team',
                        change: (e) => {
                            state.salesTeamId = e.value;
                        }
                    });
                    salesTeamListLookup.obj.appendTo(salesTeamIdRef.value);
                } else {
                    console.error('Sales Team list lookup data is not available or invalid.');
                }
            },
            refresh: () => {
                if (salesTeamListLookup.obj) {
                    salesTeamListLookup.obj.value = state.salesTeamId;
                }
            },
        };

        Vue.watch(
            () => state.salesTeamId,
            (newVal, oldVal) => {
                salesTeamListLookup.refresh();
                state.errors.salesTeamId = '';
            }
        );

        const titleText = {
            obj: null,
            create: () => {
                titleText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Title',
                });
                titleText.obj.appendTo(titleRef.value);
            },
            refresh: () => {
                if (titleText.obj) {
                    titleText.obj.value = state.title;
                }
            }
        };

        Vue.watch(
            () => state.title,
            (newVal, oldVal) => {
                titleText.refresh();
                state.errors.title = '';
            }
        );

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Project/GetProjectList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (salesTeamId, projectDateStart, projectDateFinish, title, description, status, createdById) => {
                try {
                    const response = await AxiosManager.post('/Project/CreateProject', {
                        salesTeamId, projectDateStart, projectDateFinish, title, description, status, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, salesTeamId, projectDateStart, projectDateFinish, title, description, status, updatedById) => {
                try {
                    const response = await AxiosManager.post('/Project/UpdateProject', {
                        id, salesTeamId, projectDateStart, projectDateFinish, title, description, status, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/Project/DeleteProject', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getSalesTeamListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/SalesTeam/GetSalesTeamList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getProjectStatusListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Project/GetProjectStatusList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

        const methods = {
            populateSalesTeamListLookupData: async () => {
                const response = await services.getSalesTeamListLookupData();
                state.salesTeamListLookupData = response?.data?.content?.data;
            },
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    projectDateStart: new Date(item.projectDateStart),
                    projectDateFinish: new Date(item.projectDateFinish),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateProjectStatusListLookupData: async () => {
                const response = await services.getProjectStatusListLookupData();
                state.statusListLookupData = response?.data?.content?.data;
            },
            onMainModalHidden: () => {
                state.errors.projectDateStart = '';
                state.errors.projectDateFinish = '';
                state.errors.title = '';
                state.errors.salesTeamId = '';
                state.errors.status = '';
            }
        };

        const handler = {
            handleSubmit: async function () {
                try {

                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 300));

                    if (!validateForm()) {
                        return;
                    }

                    const response = state.id === ''
                        ? await services.createMainData(state.salesTeamId, state.projectDateStart, state.projectDateFinish, state.title, state.description, state.status, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.salesTeamId, state.projectDateStart, state.projectDateFinish, state.title, state.description, state.status, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Project';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';

                            Swal.fire({
                                icon: 'success',
                                title: 'Save Successful',
                                timer: 2000,
                                showConfirmButton: false
                            });

                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Delete Successful',
                                text: 'Form will be closed...',
                                timer: 2000,
                                showConfirmButton: false
                            });
                            setTimeout(() => {
                                mainModal.obj.hide();
                                resetFormState();
                            }, 2000);
                        }

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: state.deleteMode ? 'Delete Failed' : 'Save Failed',
                            text: response.data.message ?? 'Please check your data.',
                            confirmButtonText: 'Try Again'
                        });
                    }

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'An Error Occurred',
                        text: error.response?.data?.message ?? 'Please try again.',
                        confirmButtonText: 'OK'
                    });
                } finally {
                    state.isSubmitting = false;
                }
            },
        };


        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['Projects']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                await methods.populateSalesTeamListLookupData();
                salesTeamListLookup.create();

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', methods.onMainModalHidden);
                await methods.populateProjectStatusListLookupData();
                numberText.create();
                titleText.create();
                projectDateStartPicker.create();
                projectDateFinishPicker.create();
                statusListLookup.create();

            } catch (e) {
                console.error('page init error:', e);
            } finally {
                hideSpinnerAndShowContent();
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', methods.onMainModalHidden);
        });

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
                    groupSettings: { columns: ['salesTeamName'] },
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: true,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'createdAtUtc', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: true,
                    showColumnMenu: true,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        {
                            field: 'id', isPrimaryKey: true, headerText: 'Id', visible: false
                        },
                        { field: 'number', headerText: 'Number', width: 150, minWidth: 150 },
                        { field: 'title', headerText: 'Title', width: 200, minWidth: 200 },
                        { field: 'projectDateStart', headerText: 'Start Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'projectDateFinish', headerText: 'Finish Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'statusName', headerText: 'Status', width: 150, minWidth: 150 },
                        { field: 'salesTeamName', headerText: 'Sales Team', width: 200, minWidth: 200 },
                        { field: 'createdAtUtc', headerText: 'Created At UTC', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        'ExcelExport', 'Search',
                        { type: 'Separator' },
                        { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        mainGrid.obj.autoFitColumns(['number', 'title', 'projectDateStart', 'projectDateFinish', 'statusName', 'salesTeamName', 'createdAtUtc']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
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

                        if (args.item.id === 'AddCustom') {
                            state.deleteMode = false;
                            state.mainTitle = 'Add Project';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Project';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.projectDateStart = selectedRecord.projectDateStart ? new Date(selectedRecord.projectDateStart) : null;
                                state.projectDateFinish = selectedRecord.projectDateFinish ? new Date(selectedRecord.projectDateFinish) : null;
                                state.title = selectedRecord.title ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.status = String(selectedRecord.status ?? '');
                                state.salesTeamId = selectedRecord.salesTeamId ?? null;
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Project?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.projectDateStart = selectedRecord.projectDateStart ? new Date(selectedRecord.projectDateStart) : null;
                                state.projectDateFinish = selectedRecord.projectDateFinish ? new Date(selectedRecord.projectDateFinish) : null;
                                state.title = selectedRecord.title ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.status = String(selectedRecord.status ?? '');
                                state.salesTeamId = selectedRecord.salesTeamId ?? null;
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

        const mainModal = {
            obj: null,
            create: () => {
                mainModal.obj = new bootstrap.Modal(mainModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };

        return {
            mainGridRef,
            mainModalRef,
            numberRef,
            projectDateStartRef,
            projectDateFinishRef,
            titleRef,
            salesTeamIdRef,
            statusRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');
