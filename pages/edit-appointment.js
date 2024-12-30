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
    .required("Patient Ethereum address is required")
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
  status: Yup.string().required("Status is required"),
  prescription: Yup.string().required("Prescription is required"),
  diagnosis: Yup.string().required("Diagnosis is required"),
});

class EditAppointment extends Component {
  state = {
    errorMessage: "",
    initialValues: {
      patientaddr: "",
      date: "",
      time: "",
      prescription: "",
      description: "",
      diagnosis: "",
      status: "",
    },
  };

  // Fetch data based on entered Ethereum address
  fetchAppointmentDetails = async (address) => {
    try {
      const result = await record.methods.searchAppointment(address).call();

      this.setState({
        initialValues: {
          patientaddr: address,
          date: result[2], // Date
          time: result[3], // Time
          prescription: result[5], // Prescription
          description: result[6], // Description
          diagnosis: result[4], // Diagnosis
          status: result[7], // Status
        },
      });
    } catch (err) {
      console.error("Error fetching data:", err.message);
      this.setState({
        errorMessage: "Could not fetch details for this address",
      });
    }
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
        .updateAppointment(patientaddr, {
          date: date,
          time: time,
          prescription: prescription,
          description: description,
          diagnosis: diagnosis,
          status: status,
        })
        .send({ from: accounts[0] });

      alert("Appointment updated successfully!");
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
          <h1>Update Appointment</h1>
        </Segment>
        <Segment>
          <h2 style={{ marginTop: "20px", marginBottom: "30px" }}>
            Appointment Information
          </h2>
          <Divider clearing />
          <Formik
            enableReinitialize
            initialValues={this.state.initialValues}
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
              setFieldValue,
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
                      onChange={(e) => {
                        handleChange(e);
                        const address = e.target.value;
                        if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
                          this.fetchAppointmentDetails(address); // Fetch details on valid address
                        }
                      }}
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
                      placeholder="Eg. 10/10/2024"
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
                        setFieldValue("status", value)
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
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Segment>
      </Layout>
    );
  }
}

export default EditAppointment;
