const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            salesTeamListLookupData: [],
            mainTitle: null,
            id: '',
            name: '',
            number: '',
            jobTitle: '',
            employeeNumber: '',
            phoneNumber: '',
            emailAddress: '',
            description: '',
            salesTeamId: null,
            errors: {
                name: '',
                jobTitle: '',
                phoneNumber: '',
                emailAddress: '',
                salesTeamId: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const nameRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const jobTitleRef = Vue.ref(null);
        const employeeNumberRef = Vue.ref(null);
        const phoneNumberRef = Vue.ref(null);
        const emailAddressRef = Vue.ref(null);
        const salesTeamIdRef = Vue.ref(null);

        const validateForm = function () {
            state.errors.name = '';
            state.errors.jobTitle = '';
            state.errors.phoneNumber = '';
            state.errors.emailAddress = '';
            state.errors.salesTeamId = '';

            let isValid = true;

            if (!state.name) {
                state.errors.name = 'Name is required.';
                isValid = false;
            }
            if (!state.jobTitle) {
                state.errors.jobTitle = 'Job Title is required.';
                isValid = false;
            }
            if (!state.phoneNumber) {
                state.errors.phoneNumber = 'Phone number is required.';
                isValid = false;
            }
            if (!state.emailAddress) {
                state.errors.emailAddress = 'Email address is required.';
                isValid = false;
            }
            if (!state.salesTeamId) {
                state.errors.salesTeamId = 'Sales Team is required.';
                isValid = false;
            }

            return isValid;
        };

        const resetFormState = () => {
            state.id = '';
            state.name = '';
            state.number = '';
            state.jobTitle = '';
            state.employeeNumber = '';
            state.phoneNumber = '';
            state.emailAddress = '';
            state.description = '';
            state.salesTeamId = null;
            state.errors = {
                name: '',
                jobTitle: '',
                phoneNumber: '',
                emailAddress: '',
                salesTeamId: ''
            };
        };

        const services = {
            getMainData: async () => {
                try {
                    const response = await AxiosManager.get('/SalesRepresentative/GetSalesRepresentativeList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            createMainData: async (name, jobTitle, employeeNumber, phoneNumber, emailAddress, description, salesTeamId, createdById) => {
                try {
                    const response = await AxiosManager.post('/SalesRepresentative/CreateSalesRepresentative', {
                        name, jobTitle, employeeNumber, phoneNumber, emailAddress, description, salesTeamId, createdById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            updateMainData: async (id, name, jobTitle, employeeNumber, phoneNumber, emailAddress, description, salesTeamId, updatedById) => {
                try {
                    const response = await AxiosManager.post('/SalesRepresentative/UpdateSalesRepresentative', {
                        id, name, jobTitle, employeeNumber, phoneNumber, emailAddress, description, salesTeamId, updatedById
                    });
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            deleteMainData: async (id, deletedById) => {
                try {
                    const response = await AxiosManager.post('/SalesRepresentative/DeleteSalesRepresentative', {
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
            }
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
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
        };

        const nameText = {
            obj: null,
            create: () => {
                nameText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Name'
                });
                nameText.obj.appendTo(nameRef.value);
            },
            refresh: () => {
                if (nameText.obj) {
                    nameText.obj.value = state.name;
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
            },
            refresh: () => {
                if (numberText.obj) {
                    numberText.obj.value = state.number;
                }
            }
        };

        const jobTitleText = {
            obj: null,
            create: () => {
                jobTitleText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Job Title'
                });
                jobTitleText.obj.appendTo(jobTitleRef.value);
            },
            refresh: () => {
                if (jobTitleText.obj) {
                    jobTitleText.obj.value = state.jobTitle;
                }
            }
        };

        const employeeNumberText = {
            obj: null,
            create: () => {
                employeeNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Employee Number'
                });
                employeeNumberText.obj.appendTo(employeeNumberRef.value);
            },
            refresh: () => {
                if (employeeNumberText.obj) {
                    employeeNumberText.obj.value = state.employeeNumber;
                }
            }
        };

        const phoneNumberText = {
            obj: null,
            create: () => {
                phoneNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Phone Number'
                });
                phoneNumberText.obj.appendTo(phoneNumberRef.value);
            },
            refresh: () => {
                if (phoneNumberText.obj) {
                    phoneNumberText.obj.value = state.phoneNumber;
                }
            }
        };

        const emailAddressText = {
            obj: null,
            create: () => {
                emailAddressText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Email Address'
                });
                emailAddressText.obj.appendTo(emailAddressRef.value);
            },
            refresh: () => {
                if (emailAddressText.obj) {
                    emailAddressText.obj.value = state.emailAddress;
                }
            }
        };

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
                }
            },
            refresh: () => {
                if (salesTeamListLookup.obj) {
                    salesTeamListLookup.obj.value = state.salesTeamId;
                }
            }
        };

        Vue.watch(
            () => state.name,
            (newVal, oldVal) => {
                state.errors.name = '';
                nameText.refresh();
            }
        );

        Vue.watch(
            () => state.jobTitle,
            (newVal, oldVal) => {
                state.errors.jobTitle = '';
                jobTitleText.refresh();
            }
        );

        Vue.watch(
            () => state.employeeNumber,
            (newVal, oldVal) => {
                employeeNumberText.refresh();
            }
        );

        Vue.watch(
            () => state.phoneNumber,
            (newVal, oldVal) => {
                state.errors.phoneNumber = '';
                phoneNumberText.refresh();
            }
        );

        Vue.watch(
            () => state.emailAddress,
            (newVal, oldVal) => {
                state.errors.emailAddress = '';
                emailAddressText.refresh();
            }
        );

        Vue.watch(
            () => state.salesTeamId,
            (newVal, oldVal) => {
                state.errors.salesTeamId = '';
                salesTeamListLookup.refresh();
            }
        );

        const handler = {
            handleSubmit: async function () {
                try {
                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 300));

                    if (!validateForm()) {
                        return;
                    }

                    const response = state.id === ''
                        ? await services.createMainData(state.name, state.jobTitle, state.employeeNumber, state.phoneNumber, state.emailAddress, state.description, state.salesTeamId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.name, state.jobTitle, state.employeeNumber, state.phoneNumber, state.emailAddress, state.description, state.salesTeamId, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Sales Representative';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            state.name = response?.data?.content?.data.name ?? '';
                            state.jobTitle = response?.data?.content?.data.jobTitle ?? '';
                            state.employeeNumber = response?.data?.content?.data.employeeNumber ?? '';
                            state.phoneNumber = response?.data?.content?.data.phoneNumber ?? '';
                            state.emailAddress = response?.data?.content?.data.emailAddress ?? '';
                            state.description = response?.data?.content?.data.description ?? '';
                            state.salesTeamId = response?.data?.content?.data.salesTeamId ?? '';

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
            }
        };

        Vue.onMounted(async () => {
            try {
                await SecurityManager.authorizePage(['SalesRepresentatives']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                await methods.populateSalesTeamListLookupData();
                salesTeamListLookup.create();
                nameText.create();
                numberText.create();
                jobTitleText.create();
                employeeNumberText.create();
                phoneNumberText.create();
                emailAddressText.create();

                mainModal.create();
                mainModalRef.value?.addEventListener('hidden.bs.modal', () => {
                    resetFormState();
                });

            } catch (e) {
                console.error('page init error:', e);
            } finally {
                hideSpinnerAndShowContent();
            }
        });

        Vue.onUnmounted(() => {
            mainModalRef.value?.removeEventListener('hidden.bs.modal', resetFormState);
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
                    groupSettings: {
                        columns: ['salesTeamName']
                    },
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
                        { field: 'name', headerText: 'Name', width: 200, minWidth: 200 },
                        { field: 'salesTeamName', headerText: 'Sales Team', width: 150, minWidth: 150 },
                        { field: 'jobTitle', headerText: 'Job Title', width: 150, minWidth: 150 },
                        { field: 'employeeNumber', headerText: 'Employee Number', width: 150, minWidth: 150 },
                        { field: 'phoneNumber', headerText: 'Phone', width: 150, minWidth: 150 },
                        { field: 'emailAddress', headerText: 'Email', width: 150, minWidth: 150 },
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
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom'], false);
                        mainGrid.obj.autoFitColumns(['name', 'salesTeamName', 'jobTitle', 'employeeNumber', 'phoneNumber', 'emailAddress', 'createdAtUtc']);
                    },
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
                            state.mainTitle = 'Add Sales Representative';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Sales Representative';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.jobTitle = selectedRecord.jobTitle ?? '';
                                state.employeeNumber = selectedRecord.employeeNumber ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.salesTeamId = selectedRecord.salesTeamId ?? '';
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Sales Representative?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.name = selectedRecord.name ?? '';
                                state.jobTitle = selectedRecord.jobTitle ?? '';
                                state.employeeNumber = selectedRecord.employeeNumber ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.emailAddress = selectedRecord.emailAddress ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.salesTeamId = selectedRecord.salesTeamId ?? '';
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
            nameRef,
            numberRef,
            jobTitleRef,
            employeeNumberRef,
            phoneNumberRef,
            emailAddressRef,
            salesTeamIdRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');