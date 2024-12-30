import React, { Component } from 'react';
import { Divider, Form, Input, Button, Segment, Message, Select } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import record from '../ethereum/record';
import web3 from '../ethereum/web3';

const genderOptions = [
    { key: 'm', text: 'Male', value: 'Male' },
    { key: 'f', text: 'Female', value: 'Female' },
    { key: 'o', text: 'Other', value: 'Other' },
];

const qualificationOptions = [
    { key: 'h', text: 'Higher Certificate/SPM', value: 'Higher Certificate/SPM' },
    { key: 'd', text: 'Diploma', value: 'Diploma' },
    { key: 'b', text: 'Bachelor\'s Degree', value: 'Bachelor\'s Degree' },
    { key: 'm', text: 'Master\'s Degree', value: 'Master\'s Degree' },
    { key: 'dd', text: 'Doctoral Degree', value: 'Doctoral Degree' },
];

const validationSchema = Yup.object({
    ic: Yup.string().required('IC is required').length(12, 'IC must be 12 digits'),
    name: Yup.string().required('Full Name is required'),
    phone: Yup.string().required('Phone number is required').matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.string().required('Date of Birth is required'),
    qualification: Yup.string().required('Qualification is required'),
    major: Yup.string().required('Major is required')
});

class RegisterDoctor extends Component {
    state = {
        loading: false,
        errorMessage: ''
    };

    onSubmit = async (values, { setSubmitting }) => {
        const { ic, name, phone, gender, dob, qualification, major } = values;

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await record.methods.setDoctor(
                ic, name, phone, gender, dob, qualification, major
            ).send({ from: accounts[0] });

            alert("Doctor account created successfully!");
        } catch (err) {
            this.setState({ errorMessage: err.message });
            alert("This Doctor account already exists");
        }

        setSubmitting(false);
    };

    render() {
        return (
            <Layout>
                <Segment padded><h1>Register New Doctor</h1></Segment>
                <Segment>
                    <h2 style={{ marginTop: '20px', marginBottom: '30px' }}>General Information</h2>
                    <Divider clearing />
                    <Formik
                        initialValues={{
                            ic: '',
                            name: '',
                            phone: '',
                            gender: '',
                            dob: '',
                            qualification: '',
                            major: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={this.onSubmit}
                    >
                        {({ isSubmitting, handleChange, handleBlur, values }) => (
                            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label>IC</label>
                                        <Field
                                            name="ic"
                                            placeholder="Eg. 001234010234"
                                            value={values.ic}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            as={Input}
                                        />
                                        <ErrorMessage name="ic" component="div" className="ui red message" />
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Full Name</label>
                                        <Field
                                            name="name"
                                            placeholder="Eg. John Smith"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            as={Input}
                                        />
                                        <ErrorMessage name="name" component="div" className="ui red message" />
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Phone</label>
                                        <Field
                                            name="phone"
                                            placeholder="Eg. 0123456789"
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            as={Input}
                                        />
                                        <ErrorMessage name="phone" component="div" className="ui red message" />
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <Form.Field
                                        label="Gender"
                                        control={Select}
                                        options={genderOptions}
                                        value={values.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="gender"
                                    />
                                    <ErrorMessage name="gender" component="div" className="ui red message" />

                                    <Form.Field>
                                        <label>Date of Birth</label>
                                        <Field
                                            name="dob"
                                            placeholder="Eg. 01/01/1997"
                                            value={values.dob}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            as={Input}
                                        />
                                        <ErrorMessage name="dob" component="div" className="ui red message" />
                                    </Form.Field>
                                </Form.Group>

                                <h2 style={{ marginTop: '20px', marginBottom: '30px' }}>Education Information</h2>
                                <Divider clearing />
                                <Form.Group widths='equal'>
                                    <Form.Field
                                        label="Highest Qualification"
                                        control={Select}
                                        options={qualificationOptions}
                                        value={values.qualification}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="qualification"
                                    />
                                    <ErrorMessage name="qualification" component="div" className="ui red message" />

                                    <Form.Field>
                                        <label>Major</label>
                                        <Field
                                            name="major"
                                            placeholder="Eg. Biology"
                                            value={values.major}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            as={Input}
                                        />
                                        <ErrorMessage name="major" component="div" className="ui red message" />
                                    </Form.Field>
                                </Form.Group>

                                <Message error header="Oops!" content={this.state.errorMessage} />
                                <Button primary loading={this.state.loading} disabled={isSubmitting}>Create</Button>
                            </Form>
                        )}
                    </Formik>
                </Segment>
            </Layout>
        );
    }
}

export default RegisterDoctor;
