import React, { useState } from 'react';
import { Divider, Form, Input, Button, Segment, Message, Select } from 'semantic-ui-react';
import Layout from '../components/Layout';
import record from '../ethereum/record';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const options = [
    { key: 'm', text: 'Male', value: 'Male' },
    { key: 'f', text: 'Female', value: 'Female' },
    { key: 'o', text: 'Other', value: 'Other' },
];

const allergyOptions = [
    { key: 'f', text: 'Food', value: 'Food' },
    { key: 'm', text: 'Medical', value: 'Medical' },
    { key: 'e', text: 'Environmental', value: 'Environmental' },
    { key: 'o', text: 'Others', value: 'Others' },
];

const EditPatient = () => {
    const [state, setState] = useState({
        ic: '',
        name: '',
        phone: '',
        gender: '',
        dob: '',
        height: '',
        weight: '',
        houseaddr: '',
        bloodgroup: '',
        allergies: '',
        medication: '',
        emergencyName: '',
        emergencyContact: '',
        loading: false,
        errorMessage: ''
    });

    const handleGender = (e, { value }) => setState(prevState => ({ ...prevState, gender: value }));
    const handleAllergies = (e, { value }) => setState(prevState => ({ ...prevState, allergies: value }));

    const onSubmit = async event => {
        event.preventDefault();

        const { ic, name, phone, gender, dob, height, weight, houseaddr, bloodgroup, allergies, medication, emergencyName, emergencyContact } = state;

        setState(prevState => ({ ...prevState, loading: true, errorMessage: '' }));

        try {
            const accounts = await web3.eth.getAccounts();

            await record.methods.editDetails(
                ic, name, phone, gender, dob, height, weight, houseaddr, bloodgroup, allergies, medication, emergencyName, emergencyContact
            ).send({ from: accounts[0] });

            alert("Account created successfully!");
            Router.pushRoute('/list');
        } catch (err) {
            setState(prevState => ({ ...prevState, errorMessage: err.message }));
            alert("Account already exists");
        }

        setState({
            ic: '', name: '', phone: '', gender: '', dob: '', height: '', weight: '', houseaddr: '',
            bloodgroup: '', allergies: '', medication: '', emergencyName: '', emergencyContact: '', loading: false, errorMessage: ''
        });
    };

    return (
        <Layout>
            <Segment padded><h1>Edit Record</h1></Segment>
            <Segment>
                <h2 style={{ marginTop: '20px', marginBottom: '30px' }}>General Information</h2>
                <Divider clearing />
                <Form onSubmit={onSubmit} error={!!state.errorMessage}>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>IC</label>
                            <Input
                                placeholder='Eg. 001234010234'
                                value={state.ic}
                                onChange={event => setState(prevState => ({ ...prevState, ic: event.target.value }))}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Full Name</label>
                            <Input
                                placeholder='Eg. John Smith'
                                value={state.name}
                                onChange={event => setState(prevState => ({ ...prevState, name: event.target.value }))}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Phone</label>
                            <Input
                                placeholder='Eg. 0123456789'
                                value={state.phone}
                                onChange={event => setState(prevState => ({ ...prevState, phone: event.target.value }))}
                            />
                        </Form.Field>
                    </Form.Group>
                    <br />
                    <Form.Group widths='equal'>
                        <Form.Field
                            label='Gender'
                            control={Select}
                            options={options}
                            onChange={handleGender}
                        />

                        <Form.Field>
                            <label>Date of Birth</label>
                            <Input
                                placeholder='Eg. 01/01/1997'
                                value={state.dob}
                                onChange={event => setState(prevState => ({ ...prevState, dob: event.target.value }))}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Height</label>
                            <Input
                                placeholder='Eg. 183'
                                label={{ basic: true, content: 'cm' }}
                                labelPosition='right'
                                value={state.height}
                                onChange={event => setState(prevState => ({ ...prevState, height: event.target.value }))}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Weight</label>
                            <Input
                                placeholder='Eg. 65'
                                label={{ basic: true, content: 'kg' }}
                                labelPosition='right'
                                value={state.weight}
                                onChange={event => setState(prevState => ({ ...prevState, weight: event.target.value }))}
                            />
                        </Form.Field>
                    </Form.Group>

                    <br />
                    <Form.Group widths='equal'>
                        <Form.TextArea
                            label='House Address'
                            placeholder='Eg. 1234, Jalan Seksyen 1/3, 31900 Kampar, Perak'
                            value={state.houseaddr}
                            onChange={event => setState(prevState => ({ ...prevState, houseaddr: event.target.value }))}
                        />
                    </Form.Group>

                    <br />
                    <h2 style={{ marginTop: '20px', marginBottom: '30px' }}>Medical History</h2>
                    <Divider clearing />
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>Blood Group</label>
                            <Input
                                placeholder='Eg. A-'
                                value={state.bloodgroup}
                                onChange={event => setState(prevState => ({ ...prevState, bloodgroup: event.target.value }))}
                            />
                        </Form.Field>

                        <Form.Field
                            label='Allergies'
                            control={Select}
                            options={allergyOptions}
                            onChange={handleAllergies}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group widths='equal'>
                        <Form.TextArea
                            label='Current Medications'
                            placeholder='Eg. Antidepressants'
                            value={state.medication}
                            onChange={event => setState(prevState => ({ ...prevState, medication: event.target.value }))}
                        />
                    </Form.Group>

                    <br />
                    <h2 style={{ marginTop: '20px', marginBottom: '30px' }}>Emergency Contact</h2>
                    <Divider clearing />
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>Emergency Contact Name</label>
                            <Input
                                placeholder='Eg. Taylor Smith'
                                value={state.emergencyName}
                                onChange={event => setState(prevState => ({ ...prevState, emergencyName: event.target.value }))}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Emergency Contact Phone</label>
                            <Input
                                placeholder='Eg. 0124995002'
                                value={state.emergencyContact}
                                onChange={event => setState(prevState => ({ ...prevState, emergencyContact: event.target.value }))}
                            />
                        </Form.Field>
                    </Form.Group>
                    <br />
                    <Message error header="Oops!" content={state.errorMessage} />
                    <Button primary loading={state.loading}>Edit</Button>
                </Form>
            </Segment>
        </Layout>
    );
};

export default EditPatient;
