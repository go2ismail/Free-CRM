const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            leadListLookupData: [],
            mainTitle: null,
            id: '',
            leadId: null,
            number: '',
            fullName: '',
            description: '',
            addressStreet: '',
            addressCity: '',
            addressState: '',
            addressZipCode: '',
            addressCountry: '',
            phoneNumber: '',
            faxNumber: '',
            mobileNumber: '',
            email: '',
            website: '',
            whatsApp: '',
            linkedIn: '',
            facebook: '',
            twitter: '',
            instagram: '',
            errors: {
                leadId: '',
                fullName: '',
                addressStreet: '',
                addressCity: '',
                addressState: '',
                mobileNumber: '',
                email: '',
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const leadIdRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const fullNameRef = Vue.ref(null);
        const addressStreetRef = Vue.ref(null);
        const addressCityRef = Vue.ref(null);
        const addressStateRef = Vue.ref(null);
        const addressZipCodeRef = Vue.ref(null);
        const addressCountryRef = Vue.ref(null);
        const phoneNumberRef = Vue.ref(null);
        const faxNumberRef = Vue.ref(null);
        const mobileNumberRef = Vue.ref(null);
        const emailRef = Vue.ref(null);
        const websiteRef = Vue.ref(null);
        const whatsAppRef = Vue.ref(null);
        const linkedInRef = Vue.ref(null);
        const facebookRef = Vue.ref(null);
        const twitterRef = Vue.ref(null);
        const instagramRef = Vue.ref(null);

        const services = {
            getMainData: async () => {
                const response = await AxiosManager.get('/LeadContact/GetLeadContactList', {});
                return response;
            },
            createMainData: async (leadId, fullName, description, addressStreet, addressCity, addressState, addressZipCode, addressCountry, phoneNumber, faxNumber, mobileNumber, email, website, whatsApp, linkedIn, facebook, twitter, instagram, createdById) => {
                const response = await AxiosManager.post('/LeadContact/CreateLeadContact', {
                    leadId, fullName, description, addressStreet, addressCity, addressState, addressZipCode, addressCountry, phoneNumber, faxNumber, mobileNumber, email, website, whatsApp, linkedIn, facebook, twitter, instagram, createdById
                });
                return response;
            },
            updateMainData: async (id, leadId, fullName, description, addressStreet, addressCity, addressState, addressZipCode, addressCountry, phoneNumber, faxNumber, mobileNumber, email, website, whatsApp, linkedIn, facebook, twitter, instagram, updatedById) => {
                const response = await AxiosManager.post('/LeadContact/UpdateLeadContact', {
                    id, leadId, fullName, description, addressStreet, addressCity, addressState, addressZipCode, addressCountry, phoneNumber, faxNumber, mobileNumber, email, website, whatsApp, linkedIn, facebook, twitter, instagram, updatedById
                });
                return response;
            },
            deleteMainData: async (id, deletedById) => {
                const response = await AxiosManager.post('/LeadContact/DeleteLeadContact', {
                    id, deletedById
                });
                return response;
            },
            getLeadListLookupData: async () => {
                const response = await AxiosManager.get('/Lead/GetLeadList', {});
                return response;
            }
        };

        const methods = {
            populateLeadListLookupData: async () => {
                const response = await services.getLeadListLookupData();
                state.leadListLookupData = response?.data?.content?.data;
            },
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
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
            },
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

        const fullNameText = {
            obj: null,
            create: () => {
                fullNameText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Full Name'
                });
                fullNameText.obj.appendTo(fullNameRef.value);
            },
            refresh: () => {
                if (fullNameText.obj) {
                    fullNameText.obj.value = state.fullName;
                }
            }
        };

        const addressStreetText = {
            obj: null,
            create: () => {
                addressStreetText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Street'
                });
                addressStreetText.obj.appendTo(addressStreetRef.value);
            },
            refresh: () => {
                if (addressStreetText.obj) {
                    addressStreetText.obj.value = state.addressStreet;
                }
            }
        };

        const addressCityText = {
            obj: null,
            create: () => {
                addressCityText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter City'
                });
                addressCityText.obj.appendTo(addressCityRef.value);
            },
            refresh: () => {
                if (addressCityText.obj) {
                    addressCityText.obj.value = state.addressCity;
                }
            }
        };

        const addressStateText = {
            obj: null,
            create: () => {
                addressStateText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter State'
                });
                addressStateText.obj.appendTo(addressStateRef.value);
            },
            refresh: () => {
                if (addressStateText.obj) {
                    addressStateText.obj.value = state.addressState;
                }
            }
        };

        const addressZipCodeText = {
            obj: null,
            create: () => {
                addressZipCodeText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Zip Code'
                });
                addressZipCodeText.obj.appendTo(addressZipCodeRef.value);
            },
            refresh: () => {
                if (addressZipCodeText.obj) {
                    addressZipCodeText.obj.value = state.addressZipCode;
                }
            }
        };

        const addressCountryText = {
            obj: null,
            create: () => {
                addressCountryText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Country'
                });
                addressCountryText.obj.appendTo(addressCountryRef.value);
            },
            refresh: () => {
                if (addressCountryText.obj) {
                    addressCountryText.obj.value = state.addressCountry;
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

        const faxNumberText = {
            obj: null,
            create: () => {
                faxNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Fax Number'
                });
                faxNumberText.obj.appendTo(faxNumberRef.value);
            },
            refresh: () => {
                if (faxNumberText.obj) {
                    faxNumberText.obj.value = state.faxNumber;
                }
            }
        };

        const mobileNumberText = {
            obj: null,
            create: () => {
                mobileNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Mobile Number'
                });
                mobileNumberText.obj.appendTo(mobileNumberRef.value);
            },
            refresh: () => {
                if (mobileNumberText.obj) {
                    mobileNumberText.obj.value = state.mobileNumber;
                }
            }
        };

        const emailText = {
            obj: null,
            create: () => {
                emailText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Email'
                });
                emailText.obj.appendTo(emailRef.value);
            },
            refresh: () => {
                if (emailText.obj) {
                    emailText.obj.value = state.email;
                }
            }
        };

        const websiteText = {
            obj: null,
            create: () => {
                websiteText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Website'
                });
                websiteText.obj.appendTo(websiteRef.value);
            },
            refresh: () => {
                if (websiteText.obj) {
                    websiteText.obj.value = state.website;
                }
            }
        };

        const whatsAppText = {
            obj: null,
            create: () => {
                whatsAppText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter WhatsApp'
                });
                whatsAppText.obj.appendTo(whatsAppRef.value);
            },
            refresh: () => {
                if (whatsAppText.obj) {
                    whatsAppText.obj.value = state.whatsApp;
                }
            }
        };

        const linkedInText = {
            obj: null,
            create: () => {
                linkedInText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter LinkedIn'
                });
                linkedInText.obj.appendTo(linkedInRef.value);
            },
            refresh: () => {
                if (linkedInText.obj) {
                    linkedInText.obj.value = state.linkedIn;
                }
            }
        };

        const facebookText = {
            obj: null,
            create: () => {
                facebookText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Facebook'
                });
                facebookText.obj.appendTo(facebookRef.value);
            },
            refresh: () => {
                if (facebookText.obj) {
                    facebookText.obj.value = state.facebook;
                }
            }
        };

        const twitterText = {
            obj: null,
            create: () => {
                twitterText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Twitter'
                });
                twitterText.obj.appendTo(twitterRef.value);
            },
            refresh: () => {
                if (twitterText.obj) {
                    twitterText.obj.value = state.twitter;
                }
            }
        };

        const instagramText = {
            obj: null,
            create: () => {
                instagramText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Instagram'
                });
                instagramText.obj.appendTo(instagramRef.value);
            },
            refresh: () => {
                if (instagramText.obj) {
                    instagramText.obj.value = state.instagram;
                }
            }
        };

        Vue.watch(
            () => state.leadId,
            (newVal, oldVal) => {
                leadListLookup.refresh();
                state.errors.leadId = '';
            }
        );

        Vue.watch(
            () => state.number,
            (newVal, oldVal) => {
                numberText.refresh();
            }
        );

        Vue.watch(
            () => state.fullName,
            (newVal, oldVal) => {
                state.errors.fullName = '';
                fullNameText.refresh();
            }
        );

        Vue.watch(
            () => state.addressStreet,
            (newVal, oldVal) => {
                state.errors.addressStreet = '';
                addressStreetText.refresh();
            }
        );

        Vue.watch(
            () => state.addressCity,
            (newVal, oldVal) => {
                state.errors.addressCity = '';
                addressCityText.refresh();
            }
        );

        Vue.watch(
            () => state.addressState,
            (newVal, oldVal) => {
                state.errors.addressState = '';
                addressStateText.refresh();
            }
        );

        Vue.watch(
            () => state.mobileNumber,
            (newVal, oldVal) => {
                state.errors.mobileNumber = '';
                mobileNumberText.refresh();
            }
        );

        Vue.watch(
            () => state.email,
            (newVal, oldVal) => {
                state.errors.email = '';
                emailText.refresh();
            }
        );

        const handler = {
            handleSubmit: async function () {

                state.isSubmitting = true;
                await new Promise(resolve => setTimeout(resolve, 200));

                let isValid = true;

                if (!state.leadId) {
                    state.errors.leadId = 'Lead is required.';
                    isValid = false;
                }
                if (!state.fullName) {
                    state.errors.fullName = 'Full Name is required.';
                    isValid = false;
                }
                if (!state.addressStreet) {
                    state.errors.addressStreet = 'Street is required.';
                    isValid = false;
                }
                if (!state.addressCity) {
                    state.errors.addressCity = 'City is required.';
                    isValid = false;
                }
                if (!state.addressState) {
                    state.errors.addressState = 'State is required.';
                    isValid = false;
                }
                if (!state.mobileNumber) {
                    state.errors.mobileNumber = 'Mobile Number is required.';
                    isValid = false;
                }
                if (!state.email) {
                    state.errors.email = 'Email is required.';
                    isValid = false;
                }



                try {

                    if (!isValid) {
                        return;
                    }

                    const response = state.id === ''
                        ? await services.createMainData(state.leadId, state.fullName, state.description, state.addressStreet, state.addressCity, state.addressState, state.addressZipCode, state.addressCountry, state.phoneNumber, state.faxNumber, state.mobileNumber, state.email, state.website, state.whatsApp, state.linkedIn, state.facebook, state.twitter, state.instagram, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.leadId, state.fullName, state.description, state.addressStreet, state.addressCity, state.addressState, state.addressZipCode, state.addressCountry, state.phoneNumber, state.faxNumber, state.mobileNumber, state.email, state.website, state.whatsApp, state.linkedIn, state.facebook, state.twitter, state.instagram, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Lead Contact';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            state.leadId = response?.data?.content?.data.leadId ?? '';
                            state.fullName = response?.data?.content?.data.fullName ?? '';
                            state.description = response?.data?.content?.data.description ?? '';
                            state.addressStreet = response?.data?.content?.data.addressStreet ?? '';
                            state.addressCity = response?.data?.content?.data.addressCity ?? '';
                            state.addressState = response?.data?.content?.data.addressState ?? '';
                            state.addressZipCode = response?.data?.content?.data.addressZipCode ?? '';
                            state.addressCountry = response?.data?.content?.data.addressCountry ?? '';
                            state.phoneNumber = response?.data?.content?.data.phoneNumber ?? '';
                            state.faxNumber = response?.data?.content?.data.faxNumber ?? '';
                            state.mobileNumber = response?.data?.content?.data.mobileNumber ?? '';
                            state.email = response?.data?.content?.data.email ?? '';
                            state.website = response?.data?.content?.data.website ?? '';
                            state.whatsApp = response?.data?.content?.data.whatsApp ?? '';
                            state.linkedIn = response?.data?.content?.data.linkedIn ?? '';
                            state.facebook = response?.data?.content?.data.facebook ?? '';
                            state.twitter = response?.data?.content?.data.twitter ?? '';
                            state.instagram = response?.data?.content?.data.instagram ?? '';

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
        };

        const resetFormState = () => {
            state.id = '';
            state.leadId = null;
            state.number = '';
            state.fullName = '';
            state.description = '';
            state.addressStreet = '';
            state.addressCity = '';
            state.addressState = '';
            state.addressZipCode = '';
            state.addressCountry = '';
            state.phoneNumber = '';
            state.faxNumber = '';
            state.mobileNumber = '';
            state.email = '';
            state.website = '';
            state.whatsApp = '';
            state.linkedIn = '';
            state.facebook = '';
            state.twitter = '';
            state.instagram = '';
            state.errors = {
                leadId: '',
                fullName: '',
                addressStreet: '',
                addressCity: '',
                addressState: '',
                mobileNumber: '',
                email: '',
            };
        };

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
                        { field: 'fullName', headerText: 'Full Name', width: 200 },
                        { field: 'leadTitle', headerText: 'Lead', width: 200 },
                        { field: 'addressStreet', headerText: 'Street', width: 200 },
                        { field: 'addressCity', headerText: 'City', width: 150 },
                        { field: 'addressState', headerText: 'State', width: 150 },
                        { field: 'mobileNumber', headerText: 'Mobile', width: 200 },
                        { field: 'email', headerText: 'Email', width: 200 },
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
                        mainGrid.obj.autoFitColumns(['number', 'fullName', 'leadTitle', 'addressStreet', 'addressCity', 'addressState', 'mobileNumber', 'email', 'createdAtUtc']);
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
                            state.mainTitle = 'Add Lead Contact';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Lead Contact';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.leadId = selectedRecord.leadId ?? '';
                                state.fullName = selectedRecord.fullName ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.addressStreet = selectedRecord.addressStreet ?? '';
                                state.addressCity = selectedRecord.addressCity ?? '';
                                state.addressState = selectedRecord.addressState ?? '';
                                state.addressZipCode = selectedRecord.addressZipCode ?? '';
                                state.addressCountry = selectedRecord.addressCountry ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.faxNumber = selectedRecord.faxNumber ?? '';
                                state.mobileNumber = selectedRecord.mobileNumber ?? '';
                                state.email = selectedRecord.email ?? '';
                                state.website = selectedRecord.website ?? '';
                                state.whatsApp = selectedRecord.whatsApp ?? '';
                                state.linkedIn = selectedRecord.linkedIn ?? '';
                                state.facebook = selectedRecord.facebook ?? '';
                                state.twitter = selectedRecord.twitter ?? '';
                                state.instagram = selectedRecord.instagram ?? '';
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Lead Contact?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.leadId = selectedRecord.leadId ?? '';
                                state.fullName = selectedRecord.fullName ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.addressStreet = selectedRecord.addressStreet ?? '';
                                state.addressCity = selectedRecord.addressCity ?? '';
                                state.addressState = selectedRecord.addressState ?? '';
                                state.addressZipCode = selectedRecord.addressZipCode ?? '';
                                state.addressCountry = selectedRecord.addressCountry ?? '';
                                state.phoneNumber = selectedRecord.phoneNumber ?? '';
                                state.faxNumber = selectedRecord.faxNumber ?? '';
                                state.mobileNumber = selectedRecord.mobileNumber ?? '';
                                state.email = selectedRecord.email ?? '';
                                state.website = selectedRecord.website ?? '';
                                state.whatsApp = selectedRecord.whatsApp ?? '';
                                state.linkedIn = selectedRecord.linkedIn ?? '';
                                state.facebook = selectedRecord.facebook ?? '';
                                state.twitter = selectedRecord.twitter ?? '';
                                state.instagram = selectedRecord.instagram ?? '';
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

                await SecurityManager.authorizePage(['LeadContacts']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                await methods.populateLeadListLookupData();
                leadListLookup.create();
                numberText.create();
                fullNameText.create();
                addressStreetText.create();
                addressCityText.create();
                addressStateText.create();
                addressZipCodeText.create();
                addressCountryText.create();
                phoneNumberText.create();
                faxNumberText.create();
                mobileNumberText.create();
                emailText.create();
                websiteText.create();
                whatsAppText.create();
                linkedInText.create();
                facebookText.create();
                twitterText.create();
                instagramText.create();
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
            fullNameRef,
            addressStreetRef,
            addressCityRef,
            addressStateRef,
            addressZipCodeRef,
            addressCountryRef,
            phoneNumberRef,
            faxNumberRef,
            mobileNumberRef,
            emailRef,
            websiteRef,
            whatsAppRef,
            linkedInRef,
            facebookRef,
            twitterRef,
            instagramRef,
            state,
            handler,
        };
    }
};

Vue.createApp(App).mount('#app');