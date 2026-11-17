const App = {
    setup() {
        const state = Vue.reactive({
            mainData: [],
            deleteMode: false,
            salesTeamListLookupData: [],
            campaignListLookupData: [],
            pipelineStageListLookupData: [],
            closingStatusListLookupData: [],
            contactData: [],
            activityData: [],
            mainTitle: null,
            manageContactTitle: 'Manage Contact',
            manageActivityTitle: 'Manage Activity',
            id: '',
            number: '',
            salesTeamId: null,
            title: '',
            description: '',
            companyName: '',
            companyDescription: '',
            companyAddressStreet: '',
            companyAddressCity: '',
            companyAddressState: '',
            companyAddressZipCode: '',
            companyAddressCountry: '',
            companyPhoneNumber: '',
            companyFaxNumber: '',
            companyEmail: '',
            companyWebsite: '',
            companyWhatsApp: '',
            companyLinkedIn: '',
            companyFacebook: '',
            companyInstagram: '',
            companyTwitter: '',
            dateProspecting: null,
            dateClosingEstimation: null,
            dateClosingActual: null,
            amountTargeted: null,
            amountClosed: null,
            budgetScore: null,
            authorityScore: null,
            needScore: null,
            timelineScore: null,
            pipelineStage: null,
            closingStatus: null,
            closingNote: '',
            campaignId: null,
            errors: {
                salesTeamId: '',
                title: '',
                companyName: '',
                companyAddressStreet: '',
                companyAddressCity: '',
                companyAddressState: '',
                companyPhoneNumber: '',
                companyEmail: '',
                dateProspecting: '',
                dateClosingEstimation: '',
                amountTargeted: '',
                amountClosed: '',
                budgetScore: '',
                authorityScore: '',
                needScore: '',
                timelineScore: '',
                pipelineStage: '',
                campaignId: ''
            },
            isSubmitting: false
        });

        const mainGridRef = Vue.ref(null);
        const mainModalRef = Vue.ref(null);
        const manageContactModalRef = Vue.ref(null);
        const manageActivityModalRef = Vue.ref(null);
        const contactsGridRef = Vue.ref(null);
        const activitiesGridRef = Vue.ref(null);
        const titleRef = Vue.ref(null);
        const numberRef = Vue.ref(null);
        const companyNameRef = Vue.ref(null);
        const companyAddressStreetRef = Vue.ref(null);
        const companyAddressCityRef = Vue.ref(null);
        const companyAddressStateRef = Vue.ref(null);
        const companyAddressZipCodeRef = Vue.ref(null);
        const companyAddressCountryRef = Vue.ref(null);
        const companyPhoneNumberRef = Vue.ref(null);
        const companyFaxNumberRef = Vue.ref(null);
        const companyEmailRef = Vue.ref(null);
        const companyWebsiteRef = Vue.ref(null);
        const companyWhatsAppRef = Vue.ref(null);
        const companyLinkedInRef = Vue.ref(null);
        const companyFacebookRef = Vue.ref(null);
        const companyInstagramRef = Vue.ref(null);
        const companyTwitterRef = Vue.ref(null);
        const dateProspectingRef = Vue.ref(null);
        const dateClosingEstimationRef = Vue.ref(null);
        const dateClosingActualRef = Vue.ref(null);
        const amountTargetedRef = Vue.ref(null);
        const amountClosedRef = Vue.ref(null);
        const budgetScoreRef = Vue.ref(null);
        const authorityScoreRef = Vue.ref(null);
        const needScoreRef = Vue.ref(null);
        const timelineScoreRef = Vue.ref(null);
        const pipelineStageRef = Vue.ref(null);
        const closingStatusRef = Vue.ref(null);
        const campaignIdRef = Vue.ref(null);
        const salesTeamIdRef = Vue.ref(null);

        const services = {
            getMainData: async () => {
                const response = await AxiosManager.get('/Lead/GetLeadList', {});
                return response;
            },
            createMainData: async (salesTeamId, title, description, companyName, companyDescription, companyAddressStreet, companyAddressCity, companyAddressState, companyAddressZipCode, companyAddressCountry, companyPhoneNumber, companyFaxNumber, companyEmail, companyWebsite, companyWhatsApp, companyLinkedIn, companyFacebook, companyInstagram, companyTwitter, dateProspecting, dateClosingEstimation, dateClosingActual, amountTargeted, amountClosed, budgetScore, authorityScore, needScore, timelineScore, pipelineStage, closingStatus, closingNote, campaignId, createdById) => {
                const response = await AxiosManager.post('/Lead/CreateLead', {
                    salesTeamId, title, description, companyName, companyDescription, companyAddressStreet, companyAddressCity, companyAddressState, companyAddressZipCode, companyAddressCountry, companyPhoneNumber, companyFaxNumber, companyEmail, companyWebsite, companyWhatsApp, companyLinkedIn, companyFacebook, companyInstagram, companyTwitter, dateProspecting, dateClosingEstimation, dateClosingActual, amountTargeted, amountClosed, budgetScore, authorityScore, needScore, timelineScore, pipelineStage, closingStatus, closingNote, campaignId, createdById
                });
                return response;
            },
            updateMainData: async (id, salesTeamId, title, description, companyName, companyDescription, companyAddressStreet, companyAddressCity, companyAddressState, companyAddressZipCode, companyAddressCountry, companyPhoneNumber, companyFaxNumber, companyEmail, companyWebsite, companyWhatsApp, companyLinkedIn, companyFacebook, companyInstagram, companyTwitter, dateProspecting, dateClosingEstimation, dateClosingActual, amountTargeted, amountClosed, budgetScore, authorityScore, needScore, timelineScore, pipelineStage, closingStatus, closingNote, campaignId, updatedById) => {
                const response = await AxiosManager.post('/Lead/UpdateLead', {
                    id, salesTeamId, title, description, companyName, companyDescription, companyAddressStreet, companyAddressCity, companyAddressState, companyAddressZipCode, companyAddressCountry, companyPhoneNumber, companyFaxNumber, companyEmail, companyWebsite, companyWhatsApp, companyLinkedIn, companyFacebook, companyInstagram, companyTwitter, dateProspecting, dateClosingEstimation, dateClosingActual, amountTargeted, amountClosed, budgetScore, authorityScore, needScore, timelineScore, pipelineStage, closingStatus, closingNote, campaignId, updatedById
                });
                return response;
            },
            deleteMainData: async (id, deletedById) => {
                const response = await AxiosManager.post('/Lead/DeleteLead', {
                    id, deletedById
                });
                return response;
            },
            getSalesTeamListLookupData: async () => {
                try {
                    const response = await AxiosManager.get('/SalesTeam/GetSalesTeamList', {});
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            getCampaignListLookupData: async () => {
                const response = await AxiosManager.get('/Campaign/GetCampaignList', {});
                return response;
            },
            getPipelineStageListLookupData: async () => {
                const response = await AxiosManager.get('/Lead/GetPipelineStageList', {});
                return response;
            },
            getClosingStatusListLookupData: async () => {
                const response = await AxiosManager.get('/Lead/GetClosingStatusList', {});
                return response;
            },
            getLeadContacts: async (leadId) => {
                const response = await AxiosManager.get(`/LeadContact/GetLeadContactByLeadIdList?leadId=${leadId}`, {});
                return response;
            },
            getLeadActivities: async (leadId) => {
                const response = await AxiosManager.get(`/LeadActivity/GetLeadActivityByLeadIdList?leadId=${leadId}`, {});
                return response;
            },
        };

        const methods = {
            populateSalesTeamListLookupData: async () => {
                const response = await services.getSalesTeamListLookupData();
                state.salesTeamListLookupData = response?.data?.content?.data;
            },
            populateCampaignListLookupData: async () => {
                const response = await services.getCampaignListLookupData();
                state.campaignListLookupData = response?.data?.content?.data;
            },
            populatePipelineStageListLookupData: async () => {
                const response = await services.getPipelineStageListLookupData();
                state.pipelineStageListLookupData = response?.data?.content?.data;
            },
            populateClosingStatusListLookupData: async () => {
                const response = await services.getClosingStatusListLookupData();
                state.closingStatusListLookupData = response?.data?.content?.data;
            },
            populateMainData: async () => {
                const response = await services.getMainData();
                state.mainData = response?.data?.content?.data.map(item => ({
                    ...item,
                    dateProspecting: item.dateProspecting ? new Date(item.dateProspecting) : null,
                    dateClosingEstimation: item.dateClosingEstimation ? new Date(item.dateClosingEstimation) : null,
                    dateClosingActual: item.dateClosingActual ? new Date(item.dateClosingActual) : null,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateLeadContacts: async (leadId) => {
                const response = await services.getLeadContacts(leadId);
                state.contactData = response?.data?.content?.data.map(item => ({
                    ...item,
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            },
            populateLeadActivities: async (leadId) => {
                const response = await services.getLeadActivities(leadId);
                state.activityData = response?.data?.content?.data.map(item => ({
                    ...item,
                    fromDate: new Date(item.fromDate),
                    toDate: new Date(item.toDate),
                    createdAtUtc: new Date(item.createdAtUtc)
                }));
            }
        };

        const campaignListLookup = {
            obj: null,
            create: () => {
                if (state.campaignListLookupData && Array.isArray(state.campaignListLookupData)) {
                    campaignListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.campaignListLookupData,
                        fields: { value: 'id', text: 'title' },
                        placeholder: 'Select a Campaign',
                        change: (e) => {
                            state.campaignId = e.value;
                        }
                    });
                    campaignListLookup.obj.appendTo(campaignIdRef.value);
                }
            },
            refresh: () => {
                if (campaignListLookup.obj) {
                    campaignListLookup.obj.value = state.campaignId;
                }
            }
        };

        const pipelineStageListLookup = {
            obj: null,
            create: () => {
                if (state.pipelineStageListLookupData && Array.isArray(state.pipelineStageListLookupData)) {
                    pipelineStageListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.pipelineStageListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'Select a Pipeline Stage',
                        change: (e) => {
                            state.pipelineStage = e.value;
                        }
                    });
                    pipelineStageListLookup.obj.appendTo(pipelineStageRef.value);
                }
            },
            refresh: () => {
                if (pipelineStageListLookup.obj) {
                    pipelineStageListLookup.obj.value = state.pipelineStage;
                }
            }
        };

        const closingStatusListLookup = {
            obj: null,
            create: () => {
                if (state.closingStatusListLookupData && Array.isArray(state.closingStatusListLookupData)) {
                    closingStatusListLookup.obj = new ej.dropdowns.DropDownList({
                        dataSource: state.closingStatusListLookupData,
                        fields: { value: 'id', text: 'name' },
                        placeholder: 'Select a Closing Status',
                        change: (e) => {
                            state.closingStatus = e.value;
                        }
                    });
                    closingStatusListLookup.obj.appendTo(closingStatusRef.value);
                }
            },
            refresh: () => {
                if (closingStatusListLookup.obj) {
                    closingStatusListLookup.obj.value = state.closingStatus;
                }
            }
        };

        const titleText = {
            obj: null,
            create: () => {
                titleText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Title'
                });
                titleText.obj.appendTo(titleRef.value);
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

        const companyNameText = {
            obj: null,
            create: () => {
                companyNameText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Company Name'
                });
                companyNameText.obj.appendTo(companyNameRef.value);
            }
        };

        const companyAddressStreetText = {
            obj: null,
            create: () => {
                companyAddressStreetText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Street'
                });
                companyAddressStreetText.obj.appendTo(companyAddressStreetRef.value);
            }
        };

        const companyAddressCityText = {
            obj: null,
            create: () => {
                companyAddressCityText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter City'
                });
                companyAddressCityText.obj.appendTo(companyAddressCityRef.value);
            }
        };

        const companyAddressStateText = {
            obj: null,
            create: () => {
                companyAddressStateText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter State'
                });
                companyAddressStateText.obj.appendTo(companyAddressStateRef.value);
            }
        };

        const companyAddressZipCodeText = {
            obj: null,
            create: () => {
                companyAddressZipCodeText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Zip Code'
                });
                companyAddressZipCodeText.obj.appendTo(companyAddressZipCodeRef.value);
            }
        };

        const companyAddressCountryText = {
            obj: null,
            create: () => {
                companyAddressCountryText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Country'
                });
                companyAddressCountryText.obj.appendTo(companyAddressCountryRef.value);
            }
        };

        const companyPhoneNumberText = {
            obj: null,
            create: () => {
                companyPhoneNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Phone Number'
                });
                companyPhoneNumberText.obj.appendTo(companyPhoneNumberRef.value);
            }
        };

        const companyFaxNumberText = {
            obj: null,
            create: () => {
                companyFaxNumberText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Fax Number'
                });
                companyFaxNumberText.obj.appendTo(companyFaxNumberRef.value);
            }
        };

        const companyEmailText = {
            obj: null,
            create: () => {
                companyEmailText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Email'
                });
                companyEmailText.obj.appendTo(companyEmailRef.value);
            }
        };

        const companyWebsiteText = {
            obj: null,
            create: () => {
                companyWebsiteText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Website'
                });
                companyWebsiteText.obj.appendTo(companyWebsiteRef.value);
            }
        };

        const companyWhatsAppText = {
            obj: null,
            create: () => {
                companyWhatsAppText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter WhatsApp'
                });
                companyWhatsAppText.obj.appendTo(companyWhatsAppRef.value);
            }
        };

        const companyLinkedInText = {
            obj: null,
            create: () => {
                companyLinkedInText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter LinkedIn'
                });
                companyLinkedInText.obj.appendTo(companyLinkedInRef.value);
            }
        };

        const companyFacebookText = {
            obj: null,
            create: () => {
                companyFacebookText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Facebook'
                });
                companyFacebookText.obj.appendTo(companyFacebookRef.value);
            }
        };

        const companyInstagramText = {
            obj: null,
            create: () => {
                companyInstagramText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Instagram'
                });
                companyInstagramText.obj.appendTo(companyInstagramRef.value);
            }
        };

        const companyTwitterText = {
            obj: null,
            create: () => {
                companyTwitterText.obj = new ej.inputs.TextBox({
                    placeholder: 'Enter Twitter'
                });
                companyTwitterText.obj.appendTo(companyTwitterRef.value);
            }
        };

        const dateProspectingDatePicker = {
            obj: null,
            create: () => {
                dateProspectingDatePicker.obj = new ej.calendars.DatePicker({
                    format: 'yyyy-MM-dd',
                    value: state.dateProspecting,
                    change: (e) => {
                        state.dateProspecting = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                dateProspectingDatePicker.obj.appendTo(dateProspectingRef.value);
            },
            refresh: () => {
                if (dateProspectingDatePicker.obj) {
                    dateProspectingDatePicker.obj.value = state.dateProspecting ? new Date(state.dateProspecting) : null;
                }
            }
        };

        const dateClosingEstimationDatePicker = {
            obj: null,
            create: () => {
                dateClosingEstimationDatePicker.obj = new ej.calendars.DatePicker({
                    format: 'yyyy-MM-dd',
                    value: state.dateClosingEstimation,
                    change: (e) => {
                        state.dateClosingEstimation = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                dateClosingEstimationDatePicker.obj.appendTo(dateClosingEstimationRef.value);
            },
            refresh: () => {
                if (dateClosingEstimationDatePicker.obj) {
                    dateClosingEstimationDatePicker.obj.value = state.dateClosingEstimation ? new Date(state.dateClosingEstimation) : null;
                }
            }
        };

        const dateClosingActualDatePicker = {
            obj: null,
            create: () => {
                dateClosingActualDatePicker.obj = new ej.calendars.DatePicker({
                    format: 'yyyy-MM-dd',
                    value: state.dateClosingActual,
                    change: (e) => {
                        state.dateClosingActual = DateFormatManager.preserveClientDate(e.value);
                    }
                });
                dateClosingActualDatePicker.obj.appendTo(dateClosingActualRef.value);
            },
            refresh: () => {
                if (dateClosingActualDatePicker.obj) {
                    dateClosingActualDatePicker.obj.value = state.dateClosingActual ? new Date(state.dateClosingActual) : null;
                }
            }
        };

        const amountTargetedNumeric = {
            obj: null,
            create: () => {
                amountTargetedNumeric.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Enter Target Amount',
                    format: 'n2',
                    min: 0,
                });
                amountTargetedNumeric.obj.appendTo(amountTargetedRef.value);
            },
            refresh: () => {
                if (amountTargetedNumeric.obj) {
                    amountTargetedNumeric.obj.value = parseFloat(state.amountTargeted) || 0;
                }
            }
        };

        const amountClosedNumeric = {
            obj: null,
            create: () => {
                amountClosedNumeric.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Enter Closed Amount',
                    format: 'n2',
                    min: 0,
                });
                amountClosedNumeric.obj.appendTo(amountClosedRef.value);
            },
            refresh: () => {
                if (amountClosedNumeric.obj) {
                    amountClosedNumeric.obj.value = parseFloat(state.amountClosed) || 0;
                }
            }
        };

        const budgetScoreNumeric = {
            obj: null,
            create: () => {
                budgetScoreNumeric.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Budget Score',
                    format: 'n2',
                    min: 0,
                    max: 100,
                    step: 0.01,
                });
                budgetScoreNumeric.obj.appendTo(budgetScoreRef.value);
            },
            refresh: () => {
                if (budgetScoreNumeric.obj) {
                    budgetScoreNumeric.obj.value = parseFloat(state.budgetScore);
                }
            }
        };

        const authorityScoreNumeric = {
            obj: null,
            create: () => {
                authorityScoreNumeric.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Authority Score',
                    format: 'n2',
                    min: 0,
                    max: 100,
                    step: 0.01,
                });
                authorityScoreNumeric.obj.appendTo(authorityScoreRef.value);
            },
            refresh: () => {
                if (authorityScoreNumeric.obj) {
                    authorityScoreNumeric.obj.value = parseFloat(state.authorityScore);
                }
            }
        };

        const needScoreNumeric = {
            obj: null,
            create: () => {
                needScoreNumeric.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Need Score',
                    format: 'n2',
                    min: 0,
                    max: 100,
                    step: 0.01,
                });
                needScoreNumeric.obj.appendTo(needScoreRef.value);
            },
            refresh: () => {
                if (needScoreNumeric.obj) {
                    needScoreNumeric.obj.value = parseFloat(state.needScore);
                }
            }
        };

        const timelineScoreNumeric = {
            obj: null,
            create: () => {
                timelineScoreNumeric.obj = new ej.inputs.NumericTextBox({
                    placeholder: 'Timeline Score',
                    format: 'n2',
                    min: 0,
                    max: 100,
                    step: 0.01,
                });
                timelineScoreNumeric.obj.appendTo(timelineScoreRef.value);
            },
            refresh: () => {
                if (timelineScoreNumeric.obj) {
                    timelineScoreNumeric.obj.value = parseFloat(state.timelineScore);
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

        Vue.watch(
            () => state.title,
            (newVal, oldVal) => {
                state.errors.title = '';
            }
        );

        Vue.watch(
            () => state.companyName,
            (newVal, oldVal) => {
                state.errors.companyName = '';
            }
        );

        Vue.watch(
            () => state.companyAddressStreet,
            (newVal, oldVal) => {
                state.errors.companyAddressStreet = '';
            }
        );

        Vue.watch(
            () => state.companyAddressCity,
            (newVal, oldVal) => {
                state.errors.companyAddressCity = '';
            }
        );

        Vue.watch(
            () => state.companyAddressState,
            (newVal, oldVal) => {
                state.errors.companyAddressState = '';
            }
        );

        Vue.watch(
            () => state.companyPhoneNumber,
            (newVal, oldVal) => {
                state.errors.companyPhoneNumber = '';
            }
        );

        Vue.watch(
            () => state.companyEmail,
            (newVal, oldVal) => {
                state.errors.companyEmail = '';
            }
        );

        Vue.watch(
            () => state.dateProspecting,
            (newVal, oldVal) => {
                dateProspectingDatePicker.refresh();
                state.errors.dateProspecting = '';
            }
        );

        Vue.watch(
            () => state.dateClosingEstimation,
            (newVal, oldVal) => {
                dateClosingEstimationDatePicker.refresh();
                state.errors.dateClosingEstimation = '';
            }
        );

        Vue.watch(
            () => state.dateClosingActual,
            (newVal, oldVal) => {
                dateClosingActualDatePicker.refresh();
            }
        );

        Vue.watch(
            () => state.amountTargeted,
            (newVal, oldVal) => {
                amountTargetedNumeric.refresh();
                state.errors.amountTargeted = '';
            }
        );

        Vue.watch(
            () => state.amountClosed,
            (newVal, oldVal) => {
                amountClosedNumeric.refresh();
                state.errors.amountClosed = '';
            }
        );

        Vue.watch(
            () => state.budgetScore,
            (newVal, oldVal) => {
                budgetScoreNumeric.refresh();
                state.errors.budgetScore = '';
            }
        );

        Vue.watch(
            () => state.authorityScore,
            (newVal, oldVal) => {
                authorityScoreNumeric.refresh();
                state.errors.authorityScore = '';
            }
        );

        Vue.watch(
            () => state.needScore,
            (newVal, oldVal) => {
                needScoreNumeric.refresh();
                state.errors.needScore = '';
            }
        );

        Vue.watch(
            () => state.timelineScore,
            (newVal, oldVal) => {
                timelineScoreNumeric.refresh();
                state.errors.timelineScore = '';
            }
        );

        Vue.watch(
            () => state.pipelineStage,
            (newVal, oldVal) => {
                pipelineStageListLookup.refresh();
                state.errors.pipelineStage = '';
            }
        );

        Vue.watch(
            () => state.closingStatus,
            (newVal, oldVal) => {
                closingStatusListLookup.refresh();
                state.errors.closingStatus = '';
            }
        );

        Vue.watch(
            () => state.campaignId,
            (newVal, oldVal) => {
                campaignListLookup.refresh();
                state.errors.campaignId = '';
            }
        );

        const resetFormState = () => {
            state.id = '';
            state.number = '';
            state.title = '';
            state.salesTeamId = null;
            state.description = '';
            state.companyName = '';
            state.companyDescription = '';
            state.companyAddressStreet = '';
            state.companyAddressCity = '';
            state.companyAddressState = '';
            state.companyAddressZipCode = '';
            state.companyAddressCountry = '';
            state.companyPhoneNumber = '';
            state.companyFaxNumber = '';
            state.companyEmail = '';
            state.companyWebsite = '';
            state.companyWhatsApp = '';
            state.companyLinkedIn = '';
            state.companyFacebook = '';
            state.companyInstagram = '';
            state.companyTwitter = '';
            state.dateProspecting = null;
            state.dateClosingEstimation = null;
            state.dateClosingActual = null;
            state.amountTargeted = null;
            state.amountClosed = null;
            state.budgetScore = null;
            state.authorityScore = null;
            state.needScore = null;
            state.timelineScore = null;
            state.pipelineStage = null;
            state.closingStatus = null;
            state.closingNote = '';
            state.campaignId = null;
            state.errors = {
                title: '',
                salesTeamId: '',
                companyName: '',
                companyAddressStreet: '',
                companyAddressCity: '',
                companyAddressState: '',
                companyPhoneNumber: '',
                companyEmail: '',
                dateProspecting: '',
                dateClosingEstimation: '',
                amountTargeted: '',
                amountClosed: '',
                budgetScore: '',
                authorityScore: '',
                needScore: '',
                timelineScore: '',
                pipelineStage: '',
                campaignId: ''
            };
        };

        const validateForm = function () {
            state.errors.title = '';
            state.errors.salesTeamId = '';
            state.errors.companyName = '';
            state.errors.companyAddressStreet = '';
            state.errors.companyAddressCity = '';
            state.errors.companyAddressState = '';
            state.errors.companyPhoneNumber = '';
            state.errors.companyEmail = '';
            state.errors.dateProspecting = '';
            state.errors.dateClosingEstimation = '';
            state.errors.amountTargeted = '';
            state.errors.amountClosed = '';
            state.errors.budgetScore = '';
            state.errors.authorityScore = '';
            state.errors.needScore = '';
            state.errors.timelineScore = '';
            state.errors.pipelineStage = '';
            state.errors.campaignId = '';
            
            let isValid = true;

            if (!state.title) {
                state.errors.title = 'Title is required.';
                isValid = false;
            }
            if (!state.companyName) {
                state.errors.companyName = 'Company Name is required.';
                isValid = false;
            }
            if (!state.companyAddressStreet) {
                state.errors.companyAddressStreet = 'Street is required.';
                isValid = false;
            }
            if (!state.companyAddressCity) {
                state.errors.companyAddressCity = 'City is required.';
                isValid = false;
            }
            if (!state.companyAddressState) {
                state.errors.companyAddressState = 'State is required.';
                isValid = false;
            }
            if (!state.companyPhoneNumber) {
                state.errors.companyPhoneNumber = 'Phone Number is required.';
                isValid = false;
            }
            if (!state.companyEmail) {
                state.errors.companyEmail = 'Email is required.';
                isValid = false;
            }
            if (!state.dateProspecting) {
                state.errors.dateProspecting = 'Prospecting Date is required.';
                isValid = false;
            }
            if (!state.dateClosingEstimation) {
                state.errors.dateClosingEstimation = 'Estimated Closing Date is required.';
                isValid = false;
            }
            if (state.amountTargeted === null || state.amountTargeted === '' || isNaN(state.amountTargeted)) {
                state.errors.amountTargeted = 'Targeted Amount is required.';
                isValid = false;
            }
            if (state.amountClosed === null || state.amountClosed === '' || isNaN(state.amountClosed)) {
                state.errors.amountClosed = 'Closed Amount is required.';
                isValid = false;
            }
            if (state.budgetScore === null || state.budgetScore === '' || isNaN(state.budgetScore)) {
                state.errors.budgetScore = 'Budget Score is required.';
                isValid = false;
            }
            if (state.authorityScore === null || state.authorityScore === '' || isNaN(state.authorityScore)) {
                state.errors.authorityScore = 'Authority Score is required.';
                isValid = false;
            }
            if (state.needScore === null || state.needScore === '' || isNaN(state.needScore)) {
                state.errors.needScore = 'Need Score is required.';
                isValid = false;
            }
            if (state.timelineScore === null || state.timelineScore === '' || isNaN(state.timelineScore)) {
                state.errors.timelineScore = 'Timeline Score is required.';
                isValid = false;
            }
            if (!state.pipelineStage) {
                state.errors.pipelineStage = 'Pipeline Stage is required.';
                isValid = false;
            }
            if (!state.campaignId) {
                state.errors.campaignId = 'Campaign is required.';
                isValid = false;
            }
            if (!state.salesTeamId) {
                state.errors.salesTeamId = 'Sales team is required.';
                isValid = false;
            }

            return isValid;
        };

        const handler = {
            handleSubmit: async () => {


                try {

                    state.isSubmitting = true;
                    await new Promise(resolve => setTimeout(resolve, 200));

                    if (!validateForm()) {
                        return;
                    }

                    const response = state.id === ''
                        ? await services.createMainData(state.salesTeamId, state.title, state.description, state.companyName, state.companyDescription, state.companyAddressStreet, state.companyAddressCity, state.companyAddressState, state.companyAddressZipCode, state.companyAddressCountry, state.companyPhoneNumber, state.companyFaxNumber, state.companyEmail, state.companyWebsite, state.companyWhatsApp, state.companyLinkedIn, state.companyFacebook, state.companyInstagram, state.companyTwitter, state.dateProspecting, state.dateClosingEstimation, state.dateClosingActual, state.amountTargeted, state.amountClosed, state.budgetScore, state.authorityScore, state.needScore, state.timelineScore, state.pipelineStage, state.closingStatus, state.closingNote, state.campaignId, StorageManager.getUserId())
                        : state.deleteMode
                            ? await services.deleteMainData(state.id, StorageManager.getUserId())
                            : await services.updateMainData(state.id, state.salesTeamId, state.title, state.description, state.companyName, state.companyDescription, state.companyAddressStreet, state.companyAddressCity, state.companyAddressState, state.companyAddressZipCode, state.companyAddressCountry, state.companyPhoneNumber, state.companyFaxNumber, state.companyEmail, state.companyWebsite, state.companyWhatsApp, state.companyLinkedIn, state.companyFacebook, state.companyInstagram, state.companyTwitter, state.dateProspecting, state.dateClosingEstimation, state.dateClosingActual, state.amountTargeted, state.amountClosed, state.budgetScore, state.authorityScore, state.needScore, state.timelineScore, state.pipelineStage, state.closingStatus, state.closingNote, state.campaignId, StorageManager.getUserId());

                    if (response.data.code === 200) {
                        await methods.populateMainData();
                        mainGrid.refresh();

                        if (!state.deleteMode) {
                            state.mainTitle = 'Edit Lead';
                            state.id = response?.data?.content?.data.id ?? '';
                            state.number = response?.data?.content?.data.number ?? '';
                            state.title = response?.data?.content?.data.title ?? '';
                            state.description = response?.data?.content?.data.description ?? '';
                            state.companyName = response?.data?.content?.data.companyName ?? '';
                            state.companyDescription = response?.data?.content?.data.companyDescription ?? '';
                            state.companyAddressStreet = response?.data?.content?.data.companyAddressStreet ?? '';
                            state.companyAddressCity = response?.data?.content?.data.companyAddressCity ?? '';
                            state.companyAddressState = response?.data?.content?.data.companyAddressState ?? '';
                            state.companyAddressZipCode = response?.data?.content?.data.companyAddressZipCode ?? '';
                            state.companyAddressCountry = response?.data?.content?.data.companyAddressCountry ?? '';
                            state.companyPhoneNumber = response?.data?.content?.data.companyPhoneNumber ?? '';
                            state.companyFaxNumber = response?.data?.content?.data.companyFaxNumber ?? '';
                            state.companyEmail = response?.data?.content?.data.companyEmail ?? '';
                            state.companyWebsite = response?.data?.content?.data.companyWebsite ?? '';
                            state.companyWhatsApp = response?.data?.content?.data.companyWhatsApp ?? '';
                            state.companyLinkedIn = response?.data?.content?.data.companyLinkedIn ?? '';
                            state.companyFacebook = response?.data?.content?.data.companyFacebook ?? '';
                            state.companyInstagram = response?.data?.content?.data.companyInstagram ?? '';
                            state.companyTwitter = response?.data?.content?.data.companyTwitter ?? '';
                            state.dateProspecting = response?.data?.content?.data.dateProspecting ? new Date(response.data.content.data.dateProspecting) : null;
                            state.dateClosingEstimation = response?.data?.content?.data.dateClosingEstimation ? new Date(response.data.content.data.dateClosingEstimation) : null;
                            state.dateClosingActual = response?.data?.content?.data.dateClosingActual ? new Date(response.data.content.data.dateClosingActual) : null;
                            state.amountTargeted = response?.data?.content?.data.amountTargeted ?? '';
                            state.amountClosed = response?.data?.content?.data.amountClosed ?? '';
                            state.budgetScore = response?.data?.content?.data.budgetScore ?? '';
                            state.authorityScore = response?.data?.content?.data.authorityScore ?? '';
                            state.needScore = response?.data?.content?.data.needScore ?? '';
                            state.timelineScore = response?.data?.content?.data.timelineScore ?? '';
                            state.pipelineStage = String(response?.data?.content?.data.pipelineStage ?? '');
                            state.closingStatus = String(response?.data?.content?.data.closingStatus ?? '');
                            state.closingNote = response?.data?.content?.data.closingNote ?? '';
                            state.campaignId = response?.data?.content?.data.campaignId ?? '';
                            state.salesTeamId = response?.data?.content?.data.salesTeamId ?? null;

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
            }
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
                    groupSettings: { columns: ['campaign.number'] },
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
                        { field: 'title', headerText: 'Title', width: 200 },
                        { field: 'salesTeamName', headerText: 'Sales Team', width: 200 },
                        { field: 'companyName', headerText: 'Company Name', width: 200 },
                        { field: 'companyAddressStreet', headerText: 'Street', width: 200 },
                        { field: 'companyAddressCity', headerText: 'City', width: 150 },
                        { field: 'companyAddressState', headerText: 'State', width: 150 },
                        { field: 'companyPhoneNumber', headerText: 'Phone', width: 150 },
                        { field: 'companyEmail', headerText: 'Email', width: 200 },
                        { field: 'dateProspecting', headerText: 'Prospecting Date', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'dateClosingEstimation', headerText: 'Estimated Closing', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'amountTargeted', headerText: 'Targeted Amount', width: 150, format: 'N2' },
                        { field: 'amountClosed', headerText: 'Closed Amount', width: 150, format: 'N2' },
                        { field: 'pipelineStageName', headerText: 'Pipeline Stage', width: 150 },
                        { field: 'closingStatusName', headerText: 'Closing Status', width: 150 },
                        { field: 'campaign.number', headerText: 'Campaign', width: 200 },
                        { field: 'createdAtUtc', headerText: 'Created At UTC', width: 150, format: 'yyyy-MM-dd HH:mm' }
                    ],
                    toolbar: [
                        'ExcelExport', 'Search',
                        { type: 'Separator' },
                        { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-add', id: 'AddCustom' },
                        { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-edit', id: 'EditCustom' },
                        { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-delete', id: 'DeleteCustom' },
                        { type: 'Separator' },
                        { text: 'Contact', tooltipText: ' Contact', id: 'ManageContactCustom' },
                        { text: 'Activity', tooltipText: 'Manage Activity', id: 'ManageActivityCustom' }
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'ManageContactCustom', 'ManageActivityCustom'], false);
                        mainGrid.obj.autoFitColumns(['number', 'title', 'salesTeamName', 'companyName', 'companyAddressStreet', 'companyAddressCity', 'companyAddressState', 'companyPhoneNumber', 'companyEmail', 'dateProspecting', 'dateClosingEstimation', 'amountTargeted', 'amountClosed', 'pipelineStageName', 'campaign.number', 'createdAtUtc']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'ManageContactCustom', 'ManageActivityCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'ManageContactCustom', 'ManageActivityCustom'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (mainGrid.obj.getSelectedRecords().length == 1) {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'ManageContactCustom', 'ManageActivityCustom'], true);
                        } else {
                            mainGrid.obj.toolbarModule.enableItems(['EditCustom', 'DeleteCustom', 'ManageContactCustom', 'ManageActivityCustom'], false);
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
                            state.mainTitle = 'Add Lead';
                            resetFormState();
                            mainModal.obj.show();
                        }

                        if (args.item.id === 'EditCustom') {
                            state.deleteMode = false;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Edit Lead';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.title = selectedRecord.title ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.companyName = selectedRecord.companyName ?? '';
                                state.companyDescription = selectedRecord.companyDescription ?? '';
                                state.companyAddressStreet = selectedRecord.companyAddressStreet ?? '';
                                state.companyAddressCity = selectedRecord.companyAddressCity ?? '';
                                state.companyAddressState = selectedRecord.companyAddressState ?? '';
                                state.companyAddressZipCode = selectedRecord.companyAddressZipCode ?? '';
                                state.companyAddressCountry = selectedRecord.companyAddressCountry ?? '';
                                state.companyPhoneNumber = selectedRecord.companyPhoneNumber ?? '';
                                state.companyFaxNumber = selectedRecord.companyFaxNumber ?? '';
                                state.companyEmail = selectedRecord.companyEmail ?? '';
                                state.companyWebsite = selectedRecord.companyWebsite ?? '';
                                state.companyWhatsApp = selectedRecord.companyWhatsApp ?? '';
                                state.companyLinkedIn = selectedRecord.companyLinkedIn ?? '';
                                state.companyFacebook = selectedRecord.companyFacebook ?? '';
                                state.companyInstagram = selectedRecord.companyInstagram ?? '';
                                state.companyTwitter = selectedRecord.companyTwitter ?? '';
                                state.dateProspecting = selectedRecord.dateProspecting ? new Date(selectedRecord.dateProspecting) : null;
                                state.dateClosingEstimation = selectedRecord.dateClosingEstimation ? new Date(selectedRecord.dateClosingEstimation) : null;
                                state.dateClosingActual = selectedRecord.dateClosingActual ? new Date(selectedRecord.dateClosingActual) : null;
                                state.amountTargeted = selectedRecord.amountTargeted ?? '';
                                state.amountClosed = selectedRecord.amountClosed ?? '';
                                state.budgetScore = selectedRecord.budgetScore ?? '';
                                state.authorityScore = selectedRecord.authorityScore ?? '';
                                state.needScore = selectedRecord.needScore ?? '';
                                state.timelineScore = selectedRecord.timelineScore ?? '';
                                state.pipelineStage = String(selectedRecord.pipelineStage ?? '');
                                state.closingStatus = String(selectedRecord.closingStatus ?? '');
                                state.closingNote = selectedRecord.closingNote ?? '';
                                state.campaignId = selectedRecord.campaignId ?? '';
                                state.salesTeamId = selectedRecord.salesTeamId ?? '';
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'DeleteCustom') {
                            state.deleteMode = true;
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.mainTitle = 'Delete Lead?';
                                state.id = selectedRecord.id ?? '';
                                state.number = selectedRecord.number ?? '';
                                state.title = selectedRecord.title ?? '';
                                state.description = selectedRecord.description ?? '';
                                state.companyName = selectedRecord.companyName ?? '';
                                state.companyDescription = selectedRecord.companyDescription ?? '';
                                state.companyAddressStreet = selectedRecord.companyAddressStreet ?? '';
                                state.companyAddressCity = selectedRecord.companyAddressCity ?? '';
                                state.companyAddressState = selectedRecord.companyAddressState ?? '';
                                state.companyAddressZipCode = selectedRecord.companyAddressZipCode ?? '';
                                state.companyAddressCountry = selectedRecord.companyAddressCountry ?? '';
                                state.companyPhoneNumber = selectedRecord.companyPhoneNumber ?? '';
                                state.companyFaxNumber = selectedRecord.companyFaxNumber ?? '';
                                state.companyEmail = selectedRecord.companyEmail ?? '';
                                state.companyWebsite = selectedRecord.companyWebsite ?? '';
                                state.companyWhatsApp = selectedRecord.companyWhatsApp ?? '';
                                state.companyLinkedIn = selectedRecord.companyLinkedIn ?? '';
                                state.companyFacebook = selectedRecord.companyFacebook ?? '';
                                state.companyInstagram = selectedRecord.companyInstagram ?? '';
                                state.companyTwitter = selectedRecord.companyTwitter ?? '';
                                state.dateProspecting = selectedRecord.dateProspecting ? new Date(selectedRecord.dateProspecting) : null;
                                state.dateClosingEstimation = selectedRecord.dateClosingEstimation ? new Date(selectedRecord.dateClosingEstimation) : null;
                                state.dateClosingActual = selectedRecord.dateClosingActual ? new Date(selectedRecord.dateClosingActual) : null;
                                state.amountTargeted = selectedRecord.amountTargeted ?? '';
                                state.amountClosed = selectedRecord.amountClosed ?? '';
                                state.budgetScore = selectedRecord.budgetScore ?? '';
                                state.authorityScore = selectedRecord.authorityScore ?? '';
                                state.needScore = selectedRecord.needScore ?? '';
                                state.timelineScore = selectedRecord.timelineScore ?? '';
                                state.pipelineStage = String(selectedRecord.pipelineStage ?? '');
                                state.closingStatus = String(selectedRecord.closingStatus ?? '');
                                state.closingNote = selectedRecord.closingNote ?? '';
                                state.campaignId = selectedRecord.campaignId ?? '';
                                state.salesTeamId = selectedRecord.salesTeamId ?? '';
                                mainModal.obj.show();
                            }
                        }

                        if (args.item.id === 'ManageContactCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.id = selectedRecord.id ?? '';
                                state.manageContactTitle = 'Contact';
                                await methods.populateLeadContacts(state.id);
                                contactsGrid.refresh();
                                manageContactModal.obj.show();
                            }
                        }

                        if (args.item.id === 'ManageActivityCustom') {
                            if (mainGrid.obj.getSelectedRecords().length) {
                                const selectedRecord = mainGrid.obj.getSelectedRecords()[0];
                                state.id = selectedRecord.id ?? '';
                                state.manageActivityTitle = 'Activity';
                                await methods.populateLeadActivities(state.id);
                                activitiesGrid.refresh();
                                manageActivityModal.obj.show();
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

        const manageContactModal = {
            obj: null,
            create: () => {
                manageContactModal.obj = new bootstrap.Modal(manageContactModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };

        const manageActivityModal = {
            obj: null,
            create: () => {
                manageActivityModal.obj = new bootstrap.Modal(manageActivityModalRef.value, {
                    backdrop: 'static',
                    keyboard: false
                });
            }
        };

        const contactsGrid = {
            obj: null,
            create: async (dataSource) => {
                contactsGrid.obj = new ej.grids.Grid({
                    height: 200,
                    dataSource: dataSource,
                    allowFiltering: false,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: false,
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: true,
                    allowExcelExport: true,
                    editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false, showDeleteConfirmDialog: true, mode: 'Normal', allowEditOnDblClick: true },
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'fullName', direction: 'Descending' }] },
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
                        { field: 'fullName', headerText: 'Full Name', width: 200, minWidth: 200, validationRules: { required: true } },
                        { field: 'addressStreet', headerText: 'Street', width: 200, minWidth: 200, validationRules: { required: true } },
                        { field: 'addressCity', headerText: 'City', width: 200, minWidth: 200, validationRules: { required: true } },
                        { field: 'addressState', headerText: 'State', width: 200, minWidth: 200, validationRules: { required: true } },
                        { field: 'mobileNumber', headerText: 'Mobile#', width: 200, minWidth: 200, validationRules: { required: true } },
                        { field: 'email', headerText: 'Email', width: 200, minWidth: 200, validationRules: { required: true } }
                    ],
                    toolbar: [
                        'ExcelExport'
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        contactsGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], false);
                        contactsGrid.obj.autoFitColumns(['fullName', 'addressStreet', 'addressCity', 'addressState', 'mobileNumber', 'email']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (contactsGrid.obj.getSelectedRecords().length == 1) {
                            contactsGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], true);
                        } else {
                            contactsGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (contactsGrid.obj.getSelectedRecords().length == 1) {
                            contactsGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], true);
                        } else {
                            contactsGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (contactsGrid.obj.getSelectedRecords().length) {
                            contactsGrid.obj.clearSelection();
                        }
                    },
                    actionComplete: async (args) => {
                    }
                });
                contactsGrid.obj.appendTo(contactsGridRef.value);
            },
            refresh: () => {
                contactsGrid.obj.setProperties({ dataSource: state.contactData });
            }
        };

        const activitiesGrid = {
            obj: null,
            create: async (dataSource) => {
                activitiesGrid.obj = new ej.grids.Grid({
                    height: 200,
                    dataSource: dataSource,
                    allowFiltering: false,
                    allowSorting: true,
                    allowSelection: true,
                    allowGrouping: false,
                    allowTextWrap: true,
                    allowResizing: true,
                    allowPaging: true,
                    allowExcelExport: true,
                    editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false, showDeleteConfirmDialog: true, mode: 'Normal', allowEditOnDblClick: true },
                    filterSettings: { type: 'CheckBox' },
                    sortSettings: { columns: [{ field: 'fromDate', direction: 'Descending' }] },
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
                        { field: 'typeName', headerText: 'Activity', width: 200, minWidth: 200, validationRules: { required: true } },
                        { field: 'number', headerText: 'Number', width: 200, minWidth: 200, validationRules: { required: true } },
                        { field: 'fromDate', headerText: 'From', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'toDate', headerText: 'To', width: 150, format: 'yyyy-MM-dd' },
                        { field: 'summary', headerText: 'Summary', width: 300, minWidth: 300, validationRules: { required: true } },
                    ],
                    toolbar: [
                        'ExcelExport'
                    ],
                    beforeDataBound: () => { },
                    dataBound: function () {
                        activitiesGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], false);
                        activitiesGrid.obj.autoFitColumns(['typeName', 'number', 'fromDate', 'toDate', 'summary']);
                    },
                    excelExportComplete: () => { },
                    rowSelected: () => {
                        if (activitiesGrid.obj.getSelectedRecords().length == 1) {
                            activitiesGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], true);
                        } else {
                            activitiesGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], false);
                        }
                    },
                    rowDeselected: () => {
                        if (activitiesGrid.obj.getSelectedRecords().length == 1) {
                            activitiesGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], true);
                        } else {
                            activitiesGrid.obj.toolbarModule.enableItems(['Edit', 'Delete'], false);
                        }
                    },
                    rowSelecting: () => {
                        if (activitiesGrid.obj.getSelectedRecords().length) {
                            activitiesGrid.obj.clearSelection();
                        }
                    },
                    actionComplete: async (args) => {
                    }
                });
                activitiesGrid.obj.appendTo(activitiesGridRef.value);
            },
            refresh: () => {
                activitiesGrid.obj.setProperties({ dataSource: state.activityData });
            }
        };

        Vue.onMounted(async () => {


            try {

                await SecurityManager.authorizePage(['Leads']);
                await SecurityManager.validateToken();

                await methods.populateMainData();
                await mainGrid.create(state.mainData);
                await methods.populateCampaignListLookupData();
                campaignListLookup.create();
                await methods.populateSalesTeamListLookupData();
                salesTeamListLookup.create();
                await methods.populatePipelineStageListLookupData();
                pipelineStageListLookup.create();
                await methods.populateClosingStatusListLookupData();
                closingStatusListLookup.create();
                titleText.create();
                numberText.create();
                companyNameText.create();
                companyAddressStreetText.create();
                companyAddressCityText.create();
                companyAddressStateText.create();
                companyAddressZipCodeText.create();
                companyAddressCountryText.create();
                companyPhoneNumberText.create();
                companyFaxNumberText.create();
                companyEmailText.create();
                companyWebsiteText.create();
                companyWhatsAppText.create();
                companyLinkedInText.create();
                companyFacebookText.create();
                companyInstagramText.create();
                companyTwitterText.create();
                dateProspectingDatePicker.create();
                dateClosingEstimationDatePicker.create();
                dateClosingActualDatePicker.create();
                amountTargetedNumeric.create();
                amountClosedNumeric.create();
                budgetScoreNumeric.create();
                authorityScoreNumeric.create();
                needScoreNumeric.create();
                timelineScoreNumeric.create();
                mainModal.create();
                manageContactModal.create();
                manageActivityModal.create();
                contactsGrid.create([]);
                activitiesGrid.create([]);

            } catch (e) {
                console.error('page init error:', e);
            } finally {
                hideSpinnerAndShowContent();
            }
        });

        return {
            mainGridRef,
            mainModalRef,
            manageContactModalRef,
            manageActivityModalRef,
            contactsGridRef,
            activitiesGridRef,
            titleRef,
            salesTeamIdRef,
            numberRef,
            companyNameRef,
            companyAddressStreetRef,
            companyAddressCityRef,
            companyAddressStateRef,
            companyAddressZipCodeRef,
            companyAddressCountryRef,
            companyPhoneNumberRef,
            companyFaxNumberRef,
            companyEmailRef,
            companyWebsiteRef,
            companyWhatsAppRef,
            companyLinkedInRef,
            companyFacebookRef,
            companyInstagramRef,
            companyTwitterRef,
            dateProspectingRef,
            dateClosingEstimationRef,
            dateClosingActualRef,
            amountTargetedRef,
            amountClosedRef,
            budgetScoreRef,
            authorityScoreRef,
            needScoreRef,
            timelineScoreRef,
            pipelineStageRef,
            closingStatusRef,
            campaignIdRef,
            state,
            handler
        };
    }
};

Vue.createApp(App).mount('#app');