const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            leadListLookupData: [],
            leadActivityTypeListLookupData: [],
            mainTitle: null,
            id: '',
            leadId: null,
            number: '',
            summary: '',
            description: '',
            fromDate: null,
            toDate: null,
            type: null,
            errors: {
                leadId: '',
                summary: '',
                fromDate: '',
                toDate: '',
                type: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const leadIdRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const summaryRef = Vue.ref(null);
        const fromDateRef = Vue.ref(null);
        const toDateRef = Vue.ref(null);
        const typeRef = Vue.ref(null);

        const validateForm = function () {
            state.errors.leadId = '';
            state.errors.summary = '';
            state.errors.fromDate = '';
            state.errors.toDate = '';
            state.errors.type = '';

            let isValid = true;

            if (!state.leadId) {
                state.errors.leadId = 'Lead is required.';
                isValid = false;
            }
            if (!state.summary) {
                state.errors.summary = 'Summary is required.';
                isValid = false;
            }
            if (!state.fromDate) {
                state.errors.fromDate = 'From Date is required.';
                isValid = false;
            }
            if (!state.toDate) {
                state.errors.toDate = 'To Date is required.';
                isValid = false;
            }
            if (!state.type) {
                state.errors.type = 'Type is required.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.leadId = null;
            state.number = '';
            state.summary = '';
            state.description = '';
            state.fromDate = null;
            state.toDate = null;
            state.type = null;
            state.errors = {
                leadId: '',
                summary: '',
                fromDate: '',
                toDate: '',
                type: ''
            };
        };

        const services = {
            getMainData: async () => {
                const response = await AxiosManager.get('/LeadActivity/GetLeadActivityList', {});
                return response;
            },
            createMainData: async (leadId, summary, description, fromDate, toDate, type, createdById) => {
                const response = await AxiosManager.post('/LeadActivity/CreateLeadActivity', {
                    leadId, summary, description, fromDate, toDate, type, createdById
                });
                return response;
            },
            updateMainData: async (id, leadId, summary, description, fromDate, toDate, type, updatedById) => {
                const response = await AxiosManager.post('/LeadActivity/UpdateLeadActivity', {
                    id, leadId, summary, description, fromDate, toDate, type, updatedById
                });
                return response;
            },
            deleteMainData: async (id, deletedById) => {
                const response = await AxiosManager.post('/LeadActivity/DeleteLeadActivity', {
                    id, deletedById
                });
                return response;
            },
            getLeadListLookupData: async () => {
                const response = await AxiosManager.get('/Lead/GetLeadList', {});
                return response;
            },
            getLeadActivityTypeListLookupData: async () => {
                const response = await AxiosManager.get('/LeadActivity/GetLeadActivityTypeList', {});
                return response;
            }
        };

        const methods = {
            populateLeadListLookupData: async () => {
                const response = await services.getLeadListLookupData();
                state.leadListLookupData = response?.data?.content?.data;
            },
            populateLeadActivityTypeListLookupData: async () => {
                const response = await services.getLeadActivityTypeListLookupData();
                state.leadActivityTypeListLookupData = response?.data?.content?.data;
            },
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    fromDate: item.fromDate ? new Date(item.fromDate) : null,
                    toDate: item.toDate ? new Date(item.toDate) : null,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            handleFormSubmit: async () => {

                try {

                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 200));

                    if (!validateForm()) {
                        return;
                    }

                    const response = state.id === ''
                        ? await services.createMainData(state.leadId, state.summary, state.description, state.fromDate, state.toDate, state.type, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.leadId, state.summary, state.description, state.fromDate, state.toDate, state.type, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Lead Activity';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            state.leadId = response?.data?.content?.data.leadId ?? null;
                            state.summary = response?.data?.content?.data.summary ?? '';
                            state.description = response?.data?.content?.data.description ?? '';
                            state.fromDate = response?.data?.content?.data.fromDate ? new Date(response.data.content.data.fromDate) : null;
                            state.toDate = response?.data?.content?.data.toDate ? new Date(response.data.content.data.toDate) : null;
                            state.type = String(response?.data?.content?.data.type ?? '');

                            Swal.fire({
                                icon: 'success',
                                title: 'Save Successful',
                                timer: 1000,
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
            onMainModalHidden: () => {
                state.errors.leadId = '';
                state.errors.summary = '';
                state.errors.fromDate = '';
                state.errors.toDate = '';
                state.errors.type = '';
            }
        };

        const leadListLookup = {
            obj: null,
            create: () => {
                if (state.leadListLookupData && Array.isArray(state.leadListLookupData)) {
                    leadListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.leadListLookupData,
                        fields: { value: 'id', text: 'title' },
                        placeholder: 'Select a Lead',
                        change: (e) => {
                            state.leadId = e.value;
                        }
                    });
                    leadListLookup.obj.appendTo(leadIdRef.value);
                }
            },
            refresh: () => {
                if (leadListLookup.obj) {
                    leadListLookup.obj.value = state.leadId;
                }
            }
        };

        const leadActivityTypeListLookup = {
            obj: null,
            create: () => {
                if (state.leadActivityTypeListLookupData && Array.isArray(state.leadActivityTypeListLookupData)) {
                    leadActivityTypeListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.leadActivityTypeListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'Select an Activity Type',
                        change: (e) => {
                            state.type = e.value;
                        }
                    });
                    leadActivityTypeListLookup.obj.appendTo(typeRef.value);
                }
            },
            refresh: () => {
                if (leadActivityTypeListLookup.obj) {
                    leadActivityTypeListLookup.obj.value = state.type;
                }
            }
        };

        const numberText = {
            obj: null,
            create: () => {
                numberText.obj = new ej.inputs.TextBox({
                    placeholder: '[auto]',
                    readonly: true
                });
                numberText.obj.appendTo(numberRef.value);
            }
        };

        const summaryText = {
            obj: null,
            create: () => {
                summaryText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Summary'
                });
                summaryText.obj.appendTo(summaryRef.value);
            }
        };

        const fromDatePicker = {
            obj: null,
            create: () => {
                fromDatePicker.obj = new ej.calendars.DatePicker({
                    format: 'yyyy-MM-dd',
                    value: state.fromDate,
                    change: (e) => {
                        state.fromDate = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                fromDatePicker.obj.appendTo(fromDateRef.value);
            },
            refresh: () => {
                if (fromDatePicker.obj) {
                    fromDatePicker.obj.value = state.fromDate ? new Date(state.fromDate) : null;
                }
            }
        };

        const toDatePicker = {
            obj: null,
            create: () => {
                toDatePicker.obj = new ej.calendars.DatePicker({
                    format: 'yyyy-MM-dd',
                    value: state.toDate,
                    change: (e) => {
                        state.toDate = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                toDatePicker.obj.appendTo(toDateRef.value);
            },
            refresh: () => {
                if (toDatePicker.obj) {
                    toDatePicker.obj.value = state.toDate ? new Date(state.toDate) : null;
                }
            }
        };

        Vue.watch(
            () => state.leadId,
            (newVal, oldVal) => {
                state.errors.leadId = '';
                leadListLookup.refresh();
            }
        );

        Vue.watch(
            () => state.summary,
            (newVal, oldVal) => {
                state.errors.summary = '';
            }
        );

        Vue.watch(
            () => state.fromDate,
            (newVal, oldVal) => {
                fromDatePicker.refresh();
                state.errors.fromDate = '';
            }
        );

        Vue.watch(
            () => state.toDate,
            (newVal, oldVal) => {
                toDatePicker.refresh();
                state.errors.toDate = '';
            }
        );

        Vue.watch(
            () => state.type,
            (newVal, oldVal) => {
                state.errors.type = '';
                leadActivityTypeListLookup.refresh();
            }
        );

        const mainGrid = {
            obj: null,
            create: async (dataSource) => {
                mainGrid.obj = new ej.grids.Grid({
                    height: '100%',
                    dataSource: dataSource,
                    allowFiltering: true,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: true,
                    groupSettings: { columns: ['leadTitle'] },
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
                        { field: 'number', headerText: 'Number', width: 150 },
                        { field: 'summary', headerText: 'Summary', width: 200 },
                        { field: 'leadTitle', headerText: 'Lead', width: 200 },
                        { field: 'fromDate', headerText: 'From Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'toDate', headerText: 'To Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'typeName', headerText: 'Activity Type', width: 150 },
                        { field: 'createdAtUtc', headerText: 'Created At UTC', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        'ExcelExport', 'Search',
                        { type: 'Separator' },
                        { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-delete', id: 'DeleteCustom' }
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        mainGrid.obj.autoFitColumns(['number', 'summary', 'leadTitle', 'fromDate', 'toDate', 'typeName', 'createdAtUtc']);
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
                            state.mainTitle = 'Add Lead Activity';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Lead Activity';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.leadId = selectedRecord.leadId ?? null;
                                state.summary = selectedRecord.summary ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.fromDate = selectedRecord.fromDate ? new Date(selectedRecord.fromDate) : null;
                                state.toDate = selectedRecord.toDate ? new Date(selectedRecord.toDate) : null;
                                state.type = String(selectedRecord.type ?? '');
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Lead Activity?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.leadId = selectedRecord.leadId ?? null;
                                state.summary = selectedRecord.summary ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.fromDate = selectedRecord.fromDate ? new Date(selectedRecord.fromDate) : null;
                                state.toDate = selectedRecord.toDate ? new Date(selectedRecord.toDate) : null;
                                state.type = String(selectedRecord.type ?? '');
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

        Vue.onMounted(async () => {


            try {

                await SecurityManager.authorizePage(['LeadActivities']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                await methods.populateLeadListLookupData();
                leadListLookup.create();
                await methods.populateLeadActivityTypeListLookupData();
                leadActivityTypeListLookup.create();
                numberText.create();
                summaryText.create();
                fromDatePicker.create();
                toDatePicker.create();
                mainModal.create();

            } catch (e) {
                console.error('page init error:', e);
            } finally {
                hideSpinnerAndShowContent();
            }
        });

        return {
            mainGridRef,
            mainModalRef,
            leadIdRef,
            numberRef,
            summaryRef,
            fromDateRef,
            toDateRef,
            typeRef,
            state,
            handler: {
                handleSubmit: methods.handleFormSubmit
            }
        };
    }
};

Vue.createApp(App).mount('#app');