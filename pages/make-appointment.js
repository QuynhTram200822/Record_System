import React, { Component } from "react";
import {
  Divider,
  Form,
  Input,
  Button,
  Segment,
  Message,
  Select,
} from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from "yup";
import Layout from "../components/Layout";
import record from "../ethereum/record";
import web3 from "../ethereum/web3";

const statusOptions = [
  { key: "p", text: "Pending", value: "Pending" },
  { key: "c", text: "Complete", value: "Complete" },
];

// Validation schema with Yup
const validationSchema = Yup.object({
  patientaddr: Yup.string()
    .required("Ethereum address is required")
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
  date: Yup.string()
    .required("Date is required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in the format DD/MM/YYYY"),
  time: Yup.string()
    .required("Time is required")
    .matches(
      /^(0?[1-9]|1[0-2]):[0-5][0-9][APap][Mm]$/,
      "Time must be in the format HH:MM AM/PM"
    ),
  prescription: Yup.string().required("Prescription is required"),
  diagnosis: Yup.string().required("Diagnosis is required"),
  status: Yup.string().required("Status is required"),
});

class MakeAppointment extends Component {
  state = {
    errorMessage: "",
  };

  onSubmit = async (values, { setSubmitting }) => {
    const {
      patientaddr,
      date,
      time,
      diagnosis,
      prescription,
      description,
      status,
    } = values;

    this.setState({ errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();

      await record.methods
        .setAppointment(patientaddr, {
          date: date,
          time: time,
          prescription: prescription,
          description: description,
          diagnosis: diagnosis,
          status: status,
        })
        .send({ from: accounts[0] });

      alert("Appointment created successfully!");
    } catch (err) {
      this.setState({ errorMessage: err.message });
      alert("An error has occurred");
    }

    setSubmitting(false);
  };

  render() {
    return (
      <Layout>
        <Segment padded>
          <h1>Make Appointment</h1>
        </Segment>
        <Segment>
          <h2 style={{ marginTop: "20px", marginBottom: "30px" }}>
            Appointment Information
          </h2>
          <Divider clearing />
          <Formik
            initialValues={{
              patientaddr: "",
              date: "",
              time: "",
              prescription: "",
              description: "",
              diagnosis: "",
              status: "",
            }}
            validationSchema={validationSchema}
            onSubmit={this.onSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit} error={!!this.state.errorMessage}>
                <Form.Group widths="equal">
                  <Form.Field error={touched.patientaddr && errors.patientaddr}>
                    <label>Patient's Ethereum Address</label>
                    <Input
                      placeholder="Eg. 0xF6973b46412ff52c1BfDB783D29e5218620Be542"
                      name="patientaddr"
                      value={values.patientaddr}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.patientaddr && errors.patientaddr && (
                        <span style={{ color: "red" }}>{errors.patientaddr}</span>
                    )}
                  </Form.Field>
                </Form.Group>

                <br />
                <Form.Group widths="equal">
                  <Form.Field error={touched.date && errors.date}>
                    <label>Date</label>
                    <Input
                      placeholder="Eg. 10/10/2022"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.date && errors.date && (
                        <span style={{ color: "red" }}>{errors.date}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.time && errors.time}>
                    <label>Time</label>
                    <Input
                      placeholder="Eg. 10:30am"
                      name="time"
                      value={values.time}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.time && errors.time && (
                        <span style={{ color: "red" }}>{errors.time}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.status && errors.status}>
                    <label>Status</label>
                    <Select
                      name="status"
                      options={statusOptions}
                      value={values.status}
                      onChange={(_, { value }) =>
                        handleChange({ target: { name: "status", value } })
                      }
                    />
                    {touched.status && errors.status && (
                      <span style={{ color: "red" }}>{errors.status}</span>
                    )}
                  </Form.Field>
                </Form.Group>

                <br />
                <h2 style={{ marginTop: "20px", marginBottom: "30px" }}>
                  Medical Information
                </h2>
                <Divider clearing />
                <Form.Field error={touched.prescription && errors.prescription}>
                <Form.TextArea
                  label="Prescription"
                  placeholder="Eg. Amoxicillin 500mg"
                  name="prescription"
                  value={values.prescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                   {touched.prescription && errors.prescription && (
                  <span style={{ color: "red" }}>{errors.prescription}</span>
                )}
                </Form.Field>
                <br />
                <Form.Field error={touched.diagnosis && errors.diagnosis}>
                <Form.TextArea
                  label="Diagnosis"
                  placeholder="Eg. Skin Infection"
                  name="diagnosis"
                  value={values.diagnosis}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                    {touched.diagnosis && errors.diagnosis && (
                  <span style={{ color: "red" }}>{errors.diagnosis}</span>
                )}
                </Form.Field>
              
              

                <br />
                <Form.TextArea
                  label="Notes"
                  placeholder="Eg. Still requires further observation"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <br />
                <Message
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
                <Button primary loading={isSubmitting} type="submit">
                  Create
                </Button>
              </Form>
            )}
          </Formik>
        </Segment>
      </Layout>
    );
  }
}

export default MakeAppointment;
