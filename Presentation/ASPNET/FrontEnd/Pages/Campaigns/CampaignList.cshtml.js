const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            salesTeamListLookupData: [],
            statusListLookupData: [],
            budgetData: [],
            expenseData: [],
            mainTitle: null,
            id: '',
            number: '',
            salesTeamId: null,
            campaignDateStart: '',
            campaignDateFinish: '',
            title: '',
            targetRevenueAmount: '',
            description: '',
            status: null,
            errors: {
                salesTeamId: '',
                campaignDateStart: '',
                campaignDateFinish: '',
                title: '',
                targetRevenueAmount: '',
                status: ''
            },
            showComplexDiv: false,
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const budgetGridRef = Vue.ref(null);
        const expenseGridRef = Vue.ref(null);
        const campaignDateStartRef = Vue.ref(null);
        const campaignDateFinishRef = Vue.ref(null);
        const titleRef = Vue.ref(null);
        const targetRevenueAmountRef = Vue.ref(null);
        const statusRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const salesTeamIdRef = Vue.ref(null);


        const validateForm = function () {
            state.errors.campaignDateStart = '';
            state.errors.campaignDateFinish = '';
            state.errors.title = '';
            state.errors.targetRevenueAmount = '';
            state.errors.status = '';
            state.errors.salesTeamId = '';

            let isValid = true;

            if (!state.campaignDateStart) {
                state.errors.campaignDateStart = 'Start date is required.';
                isValid = false;
            }
            if (!state.campaignDateFinish) {
                state.errors.campaignDateFinish = 'Finish date is required.';
                isValid = false;
            }
            if (!state.title) {
                state.errors.title = 'Title is required.';
                isValid = false;
            }
            if (state.targetRevenueAmount === null || state.targetRevenueAmount === '' || isNaN(state.targetRevenueAmount)) {
                state.errors.targetRevenueAmount = 'Target revenue amount is required.';
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
            state.campaignDateStart = '';
            state.campaignDateFinish = '';
            state.title = '';
            state.salesTeamId = null;
            state.targetRevenueAmount = '';
            state.description = '';
            state.status = null;
            state.errors = {
                campaignDateStart: '',
                campaignDateFinish: '',
                title: '',
                salesTeamId: '',
                targetRevenueAmount: '',
                status: ''
            };
            state.budgetData = [];
            state.expenseData = [];
        };

        const campaignDateStartPicker = {
            obj: null,
            create: () => {
                campaignDateStartPicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'Select Date',
                    format: 'yyyy-MM-dd',
                    value: state.campaignDateStart ? new Date(state.campaignDateStart) : null,
                    change: (e) => {
                        state.campaignDateStart = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                campaignDateStartPicker.obj.appendTo(campaignDateStartRef.value);
            },
            refresh: () => {
                if (campaignDateStartPicker.obj) {
                    campaignDateStartPicker.obj.value = state.campaignDateStart ? new Date(state.campaignDateStart) : null;
                }
            }
        };

        Vue.watch(
            () => state.campaignDateStart,
            (newVal, oldVal) => {
                campaignDateStartPicker.refresh();
                state.errors.campaignDateStart = '';
            }
        );

        const campaignDateFinishPicker = {
            obj: null,
            create: () => {
                campaignDateFinishPicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'Select Date',
                    format: 'yyyy-MM-dd',
                    value: state.campaignDateFinish ? new Date(state.campaignDateFinish) : null,
                    change: (e) => {
                        state.campaignDateFinish = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                campaignDateFinishPicker.obj.appendTo(campaignDateFinishRef.value);
            },
            refresh: () => {
                if (campaignDateFinishPicker.obj) {
                    campaignDateFinishPicker.obj.value = state.campaignDateFinish ? new Date(state.campaignDateFinish) : null;
                }
            }
        };

        Vue.watch(
            () => state.campaignDateFinish,
            (newVal, oldVal) => {
                campaignDateFinishPicker.refresh();
                state.errors.campaignDateFinish = '';
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


        const targetRevenueAmountText = {
            obj: null,
            create: () => {
                targetRevenueAmountText.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Enter Target Revenue Amount',
                    format: 'N2',
                    min: 0
                });
                targetRevenueAmountText.obj.appendTo(targetRevenueAmountRef.value);
            },
            refresh: () => {
                if (targetRevenueAmountText.obj) {
                    targetRevenueAmountText.obj.value = parseFloat(state.targetRevenueAmount) || 0;
                }
            }
        };

        Vue.watch(
            () => state.targetRevenueAmount,
            (newVal, oldVal) => {
                targetRevenueAmountText.refresh();
                state.errors.targetRevenueAmount = '';
            }
        );

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/Campaign/GetCampaignList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (salesTeamId, campaignDateStart, campaignDateFinish, title, targetRevenueAmount, description, status, createdById) => {
                try {
                    const response = await AxiosManager.post('/Campaign/CreateCampaign', {
                        salesTeamId, campaignDateStart, campaignDateFinish, title, targetRevenueAmount, description, status, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, salesTeamId, campaignDateStart, campaignDateFinish, title, targetRevenueAmount, description, status, updatedById) => {
                try {
                    const response = await AxiosManager.post('/Campaign/UpdateCampaign', {
                        id, salesTeamId, campaignDateStart, campaignDateFinish, title, targetRevenueAmount, description, status, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/Campaign/DeleteCampaign', {
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
            getCampaignStatusListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Campaign/GetCampaignStatusList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getBudgetData: async (campaignId) => {
                try {
                    const response = await AxiosManager.get('/Budget/GetBudgetByCampaignIdList?campaignId=' + campaignId, {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getExpenseData: async (campaignId) => {
                try {
                    const response = await AxiosManager.get('/Expense/GetExpenseByCampaignIdList?campaignId=' + campaignId, {});
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
                    campaignDateStart: new Date(item.campaignDateStart),
                    campaignDateFinish: new Date(item.campaignDateFinish),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateCampaignStatusListLookupData: async () => {
                const response = await services.getCampaignStatusListLookupData();
                state.statusListLookupData = response?.data?.content?.data;
            },
            populateBudgetData: async (campaignId) => {
                try {
                    const response = await services.getBudgetData(campaignId);
                    state.budgetData = response?.data?.content?.data.map(item => ({
                        ...item,
                        budgetDate: new Date(item.budgetDate),
                        createdAtUtc: new Date(item.createdAtUtc)
                    }));
                } catch (error) {
                    state.budgetData = [];
                }
            },
            populateExpenseData: async (campaignId) => {
                try {
                    const response = await services.getExpenseData(campaignId);
                    state.expenseData = response?.data?.content?.data.map(item => ({
                        ...item,
                        expenseDate: new Date(item.expenseDate),
                        createdAtUtc: new Date(item.createdAtUtc)
                    }));
                } catch (error) {
                    state.expenseData = [];
                }
            },
            onMainModalHidden: () => {
                state.errors.campaignDateStart = '';
                state.errors.campaignDateFinish = '';
                state.errors.title = '';
                state.errors.salesTeamId = '';
                state.errors.targetRevenueAmount = '';
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
                        ? await services.createMainData(state.salesTeamId, state.campaignDateStart, state.campaignDateFinish, state.title, state.targetRevenueAmount, state.description, state.status, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.salesTeamId, state.campaignDateStart, state.campaignDateFinish, state.title, state.targetRevenueAmount, state.description, state.status, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Campaign';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            await methods.populateBudgetData(state.id);
                            budgetGrid.refresh();
                            await methods.populateExpenseData(state.id);
                            expenseGrid.refresh();
                            state.showComplexDiv = true;

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
                await SecurityManager.authorizePage(['Campaigns']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                await methods.populateSalesTeamListLookupData();
                salesTeamListLookup.create();

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', methods.onMainModalHidden());
                await methods.populateCampaignStatusListLookupData();
                numberText.create();
                titleText.create();
                targetRevenueAmountText.create();
                campaignDateStartPicker.create();
                campaignDateFinishPicker.create();
                statusListLookup.create();

                await budgetGrid.create(state.budgetData);
                await expenseGrid.create(state.expenseData);

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
                        { field: 'campaignDateStart', headerText: 'Start Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'campaignDateFinish', headerText: 'Finish Date', width: 150, format: 'yyyy-MM-dd' },
                        {
                            field: 'targetRevenueAmount',
                            headerText: 'Target Revenue',
                            width: 100,
                            minWidth: 100,
                            format: 'N2'
                        },
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
                        mainGrid.obj.autoFitColumns(['number', 'title', 'campaignDateStart', 'campaignDateFinish', 'targetRevenueAmount', 'statusName', 'salesTeamName', 'createdAtUtc']);
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
                            state.mainTitle = 'Add Campaign';
                            resetFormState();
                            state.showComplexDiv = false;
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Campaign';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.campaignDateStart = selectedRecord.campaignDateStart ? new Date(selectedRecord.campaignDateStart) : null;
                                state.campaignDateFinish = selectedRecord.campaignDateFinish ? new Date(selectedRecord.campaignDateFinish) : null;
                                state.title = selectedRecord.title ?? '';
                                state.targetRevenueAmount = selectedRecord.targetRevenueAmount ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.status = String(selectedRecord.status ?? '');
                                state.salesTeamId = selectedRecord.salesTeamId ?? null;
                                await methods.populateBudgetData(selectedRecord.id);
                                budgetGrid.refresh();
                                await methods.populateExpenseData(selectedRecord.id);
                                expenseGrid.refresh();
                                state.showComplexDiv = true;
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Campaign?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.campaignDateStart = selectedRecord.campaignDateStart ? new Date(selectedRecord.campaignDateStart) : null;
                                state.campaignDateFinish = selectedRecord.campaignDateFinish ? new Date(selectedRecord.campaignDateFinish) : null;
                                state.title = selectedRecord.title ?? '';
                                state.targetRevenueAmount = selectedRecord.targetRevenueAmount ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.status = String(selectedRecord.status ?? '');
                                state.salesTeamId = selectedRecord.salesTeamId ?? null;
                                await methods.populateBudgetData(selectedRecord.id);
                                budgetGrid.refresh();
                                await methods.populateExpenseData(selectedRecord.id);
                                expenseGrid.refresh();
                                state.showComplexDiv = false;
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

        const budgetGrid = {
            obj: null,
            create: async (dataSource) => {
                budgetGrid.obj = new ej.grids.Grid({
                    height: 200,
                    dataSource: dataSource,
                    editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false, showDeleteConfirmDialog: true, mode: 'Normal', allowEditOnDblClick: true },
                    allowFiltering: false,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: false,
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: false,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'number', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: false,
                    showColumnMenu: false,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        {
                            field: 'id', isPrimaryKey: true, headerText: 'Id', visible: false
                        },
                        { field: 'title', headerText: 'Title', width: 200, minWidth: 200 },
                        { field: 'budgetDate', headerText: 'Budget Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'statusName', headerText: 'Status', width: 200, minWidth: 200 },
                        {
                            field: 'amount',
                            headerText: 'Amount',
                            width: 100,
                            minWidth: 100,
                            format: 'N2'
                        },
                    ],
                    toolbar: [
                        'ExcelExport',
                        { type: 'Separator' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () { },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (budgetGrid.obj.getSelectedRecords().length == 1) {
                            budgetGrid.obj.toolbarModule.enableItems(['Edit'], true);
                        } else {
                            budgetGrid.obj.toolbarModule.enableItems(['Edit'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (budgetGrid.obj.getSelectedRecords().length == 1) {
                            budgetGrid.obj.toolbarModule.enableItems(['Edit'], true);
                        } else {
                            budgetGrid.obj.toolbarModule.enableItems(['Edit'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (budgetGrid.obj.getSelectedRecords().length) {
                            budgetGrid.obj.clearSelection();
                        }
                    },
                    toolbarClick: (args) => {
                        if (args.item.id === 'BudgetGrid_excelexport') {
                            budgetGrid.obj.excelExport();
                        }
                    },
                    actionComplete: async (args) => {
                    }
                });
                budgetGrid.obj.appendTo(budgetGridRef.value);

            },
            refresh: () => {
                budgetGrid.obj.setProperties({ dataSource: state.budgetData });
            }
        };



        const expenseGrid = {
            obj: null,
            create: async (dataSource) => {
                expenseGrid.obj = new ej.grids.Grid({
                    height: 200,
                    dataSource: dataSource,
                    editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false, showDeleteConfirmDialog: true, mode: 'Normal', allowEditOnDblClick: true },
                    allowFiltering: false,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: false,
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: false,
                    allowExcelExport: true,
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'number', direction: 'Descending' }] },
                    pageSettings: { currentPage: 1, pageSize: 50, pageSizes: ["10", "20", "50", "100", "200", "All"] },
                    selectionSettings: { persistSelection: true, type: 'Single' },
                    autoFit: false,
                    showColumnMenu: false,
                    gridLines: 'Horizontal',
                    columns: [
                        { type: 'checkbox', width: 60 },
                        {
                            field: 'id', isPrimaryKey: true, headerText: 'Id', visible: false
                        },
                        { field: 'title', headerText: 'Title', width: 200, minWidth: 200 },
                        { field: 'expenseDate', headerText: 'Expense Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'statusName', headerText: 'Status', width: 200, minWidth: 200 },
                        {
                            field: 'amount',
                            headerText: 'Amount',
                            width: 100,
                            minWidth: 100,
                            format: 'N2'
                        },
                    ],
                    toolbar: [
                        'ExcelExport',
                        { type: 'Separator' },
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () { },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (expenseGrid.obj.getSelectedRecords().length == 1) {
                            expenseGrid.obj.toolbarModule.enableItems(['Edit'], true);
                        } else {
                            expenseGrid.obj.toolbarModule.enableItems(['Edit'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (expenseGrid.obj.getSelectedRecords().length == 1) {
                            expenseGrid.obj.toolbarModule.enableItems(['Edit'], true);
                        } else {
                            expenseGrid.obj.toolbarModule.enableItems(['Edit'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (expenseGrid.obj.getSelectedRecords().length) {
                            expenseGrid.obj.clearSelection();
                        }
                    },
                    toolbarClick: (args) => {
                        if (args.item.id === 'ExpenseGrid_excelexport') {
                            expenseGrid.obj.excelExport();
                        }
                    },
                    actionComplete: async (args) => {
                    }
                });
                expenseGrid.obj.appendTo(expenseGridRef.value);

            },
            refresh: () => {
                expenseGrid.obj.setProperties({ dataSource: state.expenseData });
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
            budgetGridRef,
            expenseGridRef,
            numberRef,
            campaignDateStartRef,
            campaignDateFinishRef,
            titleRef,
            salesTeamIdRef,
            targetRevenueAmountRef,
            statusRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');