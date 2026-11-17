const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            campaignListLookupData: [],
            statusListLookupData: [],
            mainTitle: null,
            id: '',
            number: '',
            budgetDate: '',
            title: '',
            amount: '',
            description: '',
            campaignId: null,
            status: null,
            errors: {
                budgetDate: '',
                title: '',
                amount: '',
                campaignId: '',
                status: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const budgetDateRef = Vue.ref(null);
        const titleRef = Vue.ref(null);
        const amountRef = Vue.ref(null);
        const campaignIdRef = Vue.ref(null);
        const statusRef = Vue.ref(null);
        const numberRef = Vue.ref(null);


        const validateForm = function () {
            state.errors.budgetDate = '';
            state.errors.title = '';
            state.errors.amount = '';
            state.errors.campaignId = '';
            state.errors.status = '';

            let isValid = true;

            if (!state.budgetDate) {
                state.errors.budgetDate = 'Budget date is required.';
                isValid = false;
            }
            if (!state.campaignId) {
                state.errors.campaignId = 'Campaign is required.';
                isValid = false;
            }
            if (!state.status) {
                state.errors.status = 'Status is required.';
                isValid = false;
            }
            if (!state.title) {
                state.errors.title = 'Title is required.';
                isValid = false;
            }
            if (state.amount === null || state.amount === '' || isNaN(state.amount)) {
                state.errors.amount = 'Amount is required.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.number = '';
            state.budgetDate = '';
            state.title = '';
            state.amount = '';
            state.description = '';
            state.campaignId = null;
            state.status = null;
            state.errors = {
                budgetDate: '',
                title: '',
                amount: '',
                campaignId: '',
                status: ''
            };
        };

        const budgetDatePicker = {
            obj: null,
            create: () => {
                budgetDatePicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'Select Date',
                    format: 'yyyy-MM-dd',
                    value: state.budgetDate ? new Date(state.budgetDate) : null,
                    change: (e) => {
                        state.budgetDate = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                budgetDatePicker.obj.appendTo(budgetDateRef.value);
            },
            refresh: () => {
                if (budgetDatePicker.obj) {
                    budgetDatePicker.obj.value = state.budgetDate ? new Date(state.budgetDate) : null;
                }
            }
        };

        Vue.watch(
            () => state.budgetDate,
            (newVal, oldVal) => {
                budgetDatePicker.refresh();
                state.errors.budgetDate = '';
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

        const campaignListLookup = {
            obj: null,
            create: () => {
                if (state.campaignListLookupData && Array.isArray(state.campaignListLookupData)) {
                    campaignListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.campaignListLookupData,
                        fields: { value: 'id', text: 'number' },
                        placeholder: 'Select Campaign',
                        filterBarPlaceholder: 'Search',
                        sortOrder: 'Ascending',
                        allowFiltering: true,
                        filtering: (e) => {
                            e.preventDefaultAction = true;
                            let query = new ej.data.Query();
                            if (e.text !== '') {
                                query = query.where('number', 'startsWith', e.text, true);
                            }
                            e.updateData(state.campaignListLookupData, query);
                        },
                        change: (e) => {
                            state.campaignId = e.value;
                        }
                    });
                    campaignListLookup.obj.appendTo(campaignIdRef.value);
                }
            },

            refresh: () => {
                if (campaignListLookup.obj) {
                    campaignListLookup.obj.value = state.campaignId
                }
            },
        };

        Vue.watch(
            () => state.campaignId,
            (newVal, oldVal) => {
                campaignListLookup.refresh();
                state.errors.campaignId = '';
            }
        );

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


        const amountText = {
            obj: null,
            create: () => {
                amountText.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Enter Amount',
                    format: 'n2',
                    min: 0,
                });
                amountText.obj.appendTo(amountRef.value);
            },
            refresh: () => {
                if (amountText.obj) {
                    amountText.obj.value = parseFloat(state.amount) || 0;
                }
            }
        };

        Vue.watch(
            () => state.amount,
            (newVal, oldVal) => {
                amountText.refresh();
                state.errors.amount = '';
            }
        );

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Budget/GetBudgetList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (budgetDate, title, amount, description, status, campaignId, createdById) => {
                try {
                    const response = await AxiosManager.post('/Budget/CreateBudget', {
                        budgetDate, title, amount, description, status, campaignId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, budgetDate, title, amount, description, status, campaignId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/Budget/UpdateBudget', {
                        id, budgetDate, title, amount, description, status, campaignId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/Budget/DeleteBudget', {
                        id, deletedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getCampaignListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Campaign/GetCampaignList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getBudgetStatusListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Budget/GetBudgetStatusList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

        const methods = {
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    budgetDate: new Date(item.budgetDate),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateCampaignListLookupData: async () => {
                const response = await services.getCampaignListLookupData();
                state.campaignListLookupData = response?.data?.content?.data;
            },
            populateBudgetStatusListLookupData: async () => {
                const response = await services.getBudgetStatusListLookupData();
                state.statusListLookupData = response?.data?.content?.data;
            },
            onMainModalHidden: () => {
                state.errors.budgetDate = '';
                state.errors.title = '';
                state.errors.amount = '';
                state.errors.campaignId = '';
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
                        ? await services.createMainData(state.budgetDate, state.title, state.amount, state.description, state.status, state.campaignId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.budgetDate, state.title, state.amount, state.description, state.status, state.campaignId, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();
                        Swal.fire({
                            icon: 'success',
                            title: state.deleteMode ? 'Delete Successful' : 'Save Successful',
                            text: 'Form will be closed...',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        setTimeout(() => {
                            mainModal.obj.hide();
                        }, 2000);
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
                await SecurityManager.authorizePage(['Budgets']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', methods.onMainModalHidden());
                await methods.populateCampaignListLookupData();
                await methods.populateBudgetStatusListLookupData();
                numberText.create();
                budgetDatePicker.create();
                titleText.create();
                amountText.create();
                campaignListLookup.create();
                statusListLookup.create();


            } catch (e) {
                console.error('page init error:', e);
            } finally {
                hideSpinnerAndShowContent();
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', methods.onMainModalHidden());
        });

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
                        { field: 'budgetDate', headerText: 'Budget Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'campaignName', headerText: 'Campaign', width: 150, minWidth: 150 },
                        {
                            field: 'amount',
                            headerText: 'Amount',
                            width: 100,
                            minWidth: 100,
                            format: 'N2'
                        },
                        { field: 'statusName', headerText: 'Status', width: 150, minWidth: 150 },
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
                        mainGrid.obj.autoFitColumns(['number', 'title', 'budgetDate', 'campaignNumber', 'amount', 'statusName', 'createdAtUtc']);
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
                            state.mainTitle = 'Add Budget';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Budget';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.budgetDate = selectedRecord.budgetDate ? new Date(selectedRecord.budgetDate) : null;
                                state.title = selectedRecord.title ?? '';
                                state.amount = selectedRecord.amount ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.campaignId = selectedRecord.campaignId ?? '';
                                state.status = String(selectedRecord.status ?? '');
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Budget?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.budgetDate = selectedRecord.budgetDate ? new Date(selectedRecord.budgetDate) : null;
                                state.title = selectedRecord.title ?? '';
                                state.amount = selectedRecord.amount ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.campaignId = selectedRecord.campaignId ?? '';
                                state.status = String(selectedRecord.status ?? '');
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
            budgetDateRef,
            titleRef,
            amountRef,
            campaignIdRef,
            statusRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');