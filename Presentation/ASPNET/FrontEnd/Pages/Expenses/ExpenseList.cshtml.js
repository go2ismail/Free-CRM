const App = {
    setup() {
        const state = Vue.reactive({
            confirmationData: null,
            validationData: null,
            showConfirmationModal: false, 
            mainData: [],
            deleteMode: false,
            campaignListLookupData: [],
            statusListLookupData: [],
            mainTitle: null,
            id: '',
            number: '',
            expenseDate: '',
            title: '',
            amount: '',
            description: '',
            campaignId: null,
            status: null,
            errors: {
                expenseDate: '',
                title: '',
                amount: '',
                campaignId: '',
                status: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const expenseDateRef = Vue.ref(null);
        const titleRef = Vue.ref(null);
        const amountRef = Vue.ref(null);
        const campaignIdRef = Vue.ref(null);
        const statusRef = Vue.ref(null);
        const numberRef = Vue.ref(null);


        const validateForm = function () {
            state.errors.expenseDate = '';
            state.errors.title = '';
            state.errors.amount = '';
            state.errors.campaignId = '';
            state.errors.status = '';

            let isValid = true;

            if (!state.expenseDate) {
                state.errors.expenseDate = 'Expense date is required.';
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
            state.confirmationData= null;
            state.validationData= null;
            state.showConfirmationModal= false;
            state.id = '';
            state.number = '';
            state.expenseDate = '';
            state.title = '';
            state.amount = '';
            state.description = '';
            state.campaignId = null;
            state.status = null;
            state.errors = {
                expenseDate: '',
                title: '',
                amount: '',
                campaignId: '',
                status: ''
            };
        };

        const expenseDatePicker = {
            obj: null,
            create: () => {
                expenseDatePicker.obj = new ej.calendars.DatePicker({
                    placeholder: 'Select Date',
                    format: 'yyyy-MM-dd',
                    value: state.expenseDate ? new Date(state.expenseDate) : null,
                    change: (e) => {
                        state.expenseDate = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                expenseDatePicker.obj.appendTo(expenseDateRef.value);
            },
            refresh: () => {
                if (expenseDatePicker.obj) {
                    expenseDatePicker.obj.value = state.expenseDate ? new Date(state.expenseDate) : null;
                }
            }
        };

        Vue.watch(
            () => state.expenseDate,
            (newVal, oldVal) => {
                expenseDatePicker.refresh();
                state.errors.expenseDate = '';
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
                    format: 'N2',
                    min: 0,
                    max: 1000000000,
                    step: 0.01,
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
                    const response = await AxiosManager.get('/Expense/GetExpenseList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            
            
            createMainData: async (expenseDate, title, amount, description, status, campaignId, createdById) => {
                try {
                    const response = await AxiosManager.post('/Expense/CreateExpense', {
                        expenseDate, title, amount, description, status, campaignId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            
            updateMainData: async (id, expenseDate, title, amount, description, status, campaignId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/Expense/UpdateExpense', {
                        id, expenseDate, title, amount, description, status, campaignId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/Expense/DeleteExpense', {
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
            getExpenseStatusListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/Expense/GetExpenseStatusList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
        };

        const methods = {
            checkBudgetAlert: async () => {
                try {
                    const response = await AxiosManager.get('/Expense/ValidateExpense?campaignId='+state.campaignId+'&amount='+state.amount, {
                    });
                    state.confirmationData = {
                        expenseDate: state.expenseDate,
                        title: state.title,
                        amount: state.amount,
                        description: state.description,
                        status: state.status,
                        campaignId: state.campaignId,
                    };

                    if (response.data.alert) {
                        console.log(response.data);
                        state.validationData = {
                            totalBudget: response.data.data.totalBudget, 
                            totalExpense: response.data.data.totalExpenses,
                            budgetAlert: response.data.data.budgetAlertThreshold,
                        };
                        state.showConfirmationModal = true;
                    } else {
                        await methods.createExpense();
                    }
                } catch (error) {
                    console.error('Error checking budget alert:', error);
                }
            },
            createExpensecreateExpense: async () => {
                try {
                    const response = await services.createMainData(
                        state.confirmationData.expenseDate,
                        state.confirmationData.title,
                        state.confirmationData.amount,
                        state.confirmationData.description,
                        state.confirmationData.status,
                        state.confirmationData.campaignId,
                        StorageManager.getUserId()
                    );
                    if (response.data.code === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Expense Created Successfully',
                            text: 'The expense has been created.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Creation Failed',
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
                    state.showConfirmationModal = false; // Fermer la modal après l'opération
                }
            },
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    expenseDate: new Date(item.expenseDate),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateCampaignListLookupData: async () => {
                const response = await services.getCampaignListLookupData();
                state.campaignListLookupData = response?.data?.content?.data;
            },
            populateExpenseStatusListLookupData: async () => {
                const response = await services.getExpenseStatusListLookupData();
                state.statusListLookupData = response?.data?.content?.data;
            },
            onMainModalHidden: () => {
                state.errors.expenseDate = '';
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
                        state.isSubmitting = false;
                        return;
                    }
                    if (state.id === '') {
                        await methods.checkBudgetAlert(state.campaignId, state.amount);
                    }

                    if (state.showConfirmationModal) {
                        Swal.fire({
                            title: 'Budget Alert',
                            html: `
                                <p>Warning: Your expenses have exceeded the budget limit. Do you want to proceed with creating this expense?</p>
                                <ul>
                                    <li><strong>Total budget:</strong> ${state.validationData?.totalBudget || 'N/A'}</li>
                                    <li><strong>Total expenses:</strong> ${state.validationData?.totalExpense || 'N/A'}</li>
                                    <li><strong>Percent limit:</strong> ${state.validationData?.budgetAlert || 'N/A'}</li>
                                </ul>
                            `,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Confirm',
                            cancelButtonText: 'Dismiss',
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handler.handleSubmitConfirmed();
                            } else {
                                mainGrid.refresh();
                                Swal.fire({
                                    icon: 'info',
                                    title: 'Action Cancelled',
                                    text: 'No changes have been made.',
                                    timer: 2000,
                                    showConfirmButton: false
                                });
                                setTimeout(() => {
                                    mainModal.obj.hide();
                                }, 2000);
                            }
                        });
                        state.showConfirmationModal = false;
                        return; 
                    }

                    const response = state.id === ''
                        ? await services.createMainData(state.expenseDate, state.title, state.amount, state.description, state.status, state.campaignId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.expenseDate, state.title, state.amount, state.description, state.status, state.campaignId, StorageManager.getUserId());

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
                    state.showConfirmationModal = false;
                }
            },


            handleSubmitConfirmed: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 300));
                    if (!validateForm()) {
                        return;
                    }

                    const response = state.id === ''
                            ? await services.createMainData(state.expenseDate, state.title, state.amount, state.description, state.status, state.campaignId, StorageManager.getUserId())
                            : state.deleteMode
                                ? await services.deleteMainData(state.id, StorageManager.getUserId())
                                : await services.updateMainData(state.id, state.expenseDate, state.title, state.amount, state.description, state.status, state.campaignId, StorageManager.getUserId());

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
                    state.showConfirmationModal = false;
                }
            },
            closeModel : function closeModal() {
                state.showConfirmationModal = false;
            }

    };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['Expenses']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', methods.onMainModalHidden());
                await methods.populateCampaignListLookupData();
                await methods.populateExpenseStatusListLookupData();
                numberText.create();
                expenseDatePicker.create();
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
                        { field: 'expenseDate', headerText: 'Expense Date', width: 150, format: 'yyyy-MM-dd' },
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
                        mainGrid.obj.autoFitColumns(['number', 'title', 'expenseDate', 'campaignName', 'amount', 'statusName', 'createdAtUtc']);
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
                            state.mainTitle = 'Add Expense';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Expense';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.expenseDate = selectedRecord.expenseDate ? new Date(selectedRecord.expenseDate) : null;
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
                                state.mainTitle = 'Delete Expense?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.expenseDate = selectedRecord.expenseDate ? new Date(selectedRecord.expenseDate) : null;
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
            expenseDateRef,
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