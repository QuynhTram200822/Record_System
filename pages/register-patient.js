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
import Layout from "../components/Layout";
import record from "../ethereum/record";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import { Formik } from "formik";
import * as Yup from "yup";

const options = [
  { key: "m", text: "Male", value: "Male" },
  { key: "f", text: "Female", value: "Female" },
  { key: "o", text: "Other", value: "Other" },
];

const allergyOptions = [
  { key: "f", text: "Food", value: "Food" },
  { key: "m", text: "Medical", value: "Medical" },
  { key: "e", text: "Environmental", value: "Environmental" },
  { key: "o", text: "Others", value: "Others" },
];

// Validation schema with Yup
const validationSchema = Yup.object({
  ic: Yup.string()
    .required("IC is required")
    .matches(/^\d{12}$/, "IC must be 12 number"),
  name: Yup.string().required("Full name is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone must be 10 number"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string()
    .required("Date of birth is required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  height: Yup.number()
    .required("Height is required")
    .positive("Height must be positive")
    .integer("Height must be an integer"),
  weight: Yup.number()
    .required("Weight is required")
    .positive("Weight must be positive"),
  houseaddr: Yup.string().required("House address is required"),
  bloodgroup: Yup.string().required("Blood group is required"),
  allergies: Yup.string().required("Allergies are required"),
  medication: Yup.string().required("Current medications are required"),
  emergencyName: Yup.string().required("Emergency contact name is required"),
  emergencyContact: Yup.string()
    .required("Emergency contact phone is required")
    .matches(/^\d{10}$/, "Phone must be 10 number"),
});

class RegisterPatient extends Component {
  state = {
    ic: "",
    name: "",
    phone: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
    houseaddr: "",
    bloodgroup: "",
    allergies: "",
    medication: "",
    emergencyName: "",
    emergencyContact: "",
    loading: false,
    errorMessage: "",
  };

  onSubmit = async (values, { setSubmitting }) => {
    const {
      ic,
      name,
      phone,
      gender,
      dob,
      height,
      weight,
      houseaddr,
      bloodgroup,
      allergies,
      medication,
      emergencyName,
      emergencyContact,
    } = values;

    this.setState({ loading: true, errorMessage: "" });

    try {
      // Gửi lên blockchain trước
      const accounts = await web3.eth.getAccounts();
      await record.methods
        .setDetails(
          ic,
          name,
          phone,
          gender,
          dob,
          height,
          weight,
          houseaddr,
          bloodgroup,
          allergies,
          medication,
          emergencyName,
          emergencyContact
        )
        .send({ from: accounts[0] });

      // Nếu thành công, tiếp tục lưu vào MySQL
      const response = await fetch("http://localhost:5000/register-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ic,
          name,
          phone,
          gender,
          dob,
          height,
          weight,
          houseaddr,
          bloodgroup,
          allergies,
          medication,
          emergencyName,
          emergencyContact,
          addr: this.state.addr,
        }),
      });

      if (response.ok) {
        alert("Account created successfully!");
        Router.pushRoute("/list");
      } else {
        throw new Error("Failed to save data to MySQL");
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
      alert("Account already exists or failed to process");
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Segment padded>
          <h1>Create New Record</h1>
        </Segment>
        <Segment>
          <h2 style={{ marginTop: "10px", marginBottom: "30px" }}>
            General Information
          </h2>
          <Divider clearing />
          <Formik
            initialValues={{
              ic: this.state.ic,
              name: this.state.name,
              phone: this.state.phone,
              gender: this.state.gender,
              dob: this.state.dob,
              height: this.state.height,
              weight: this.state.weight,
              houseaddr: this.state.houseaddr,
              bloodgroup: this.state.bloodgroup,
              allergies: this.state.allergies,
              medication: this.state.medication,
              emergencyName: this.state.emergencyName,
              emergencyContact: this.state.emergencyContact,
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
                  <Form.Field error={touched.ic && errors.ic}>
                    <label>IC</label>
                    <Input
                      placeholder="Eg. 001234010234"
                      name="ic"
                      value={values.ic}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.ic && errors.ic && (
                      <span style={{ color: "red" }}>{errors.ic}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.name && errors.name}>
                    <label>Full Name</label>
                    <Input
                      placeholder="Eg. John Smith"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.name && errors.name && (
                      <span style={{ color: "red" }}>{errors.name}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.phone && errors.phone}>
                    <label>Phone</label>
                    <Input
                      placeholder="Eg. 0123456789"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.phone && errors.phone && (
                      <span style={{ color: "red" }}>{errors.phone}</span>
                    )}
                  </Form.Field>
                </Form.Group>

                <br />
                <Form.Group widths="equal">
                  <Form.Field error={touched.gender && errors.gender}>
                    <label>Gender</label>
                    <Select
                      name="gender"
                      options={options}
                      value={values.gender}
                      onChange={(_, { value }) =>
                        handleChange({ target: { name: "gender", value } })
                      }
                    />
                    {touched.gender && errors.gender && (
                      <span style={{ color: "red" }}>{errors.gender}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.dob && errors.dob}>
                    <label>Date of Birth</label>
                    <Input
                      placeholder="Eg. 01/01/1997"
                      name="dob"
                      value={values.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.dob && errors.dob && (
                      <span style={{ color: "red" }}>{errors.dob}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.height && errors.height}>
                    <label>Height</label>
                    <Input
                      placeholder="Eg. 183"
                      label={{ basic: true, content: "cm" }}
                      labelPosition="right"
                      name="height"
                      value={values.height}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.height && errors.height && (
                      <span style={{ color: "red" }}>{errors.height}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.weight && errors.weight}>
                    <label>Weight</label>
                    <Input
                      placeholder="Eg. 65"
                      label={{ basic: true, content: "kg" }}
                      labelPosition="right"
                      name="weight"
                      value={values.weight}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.weight && errors.weight && (
                      <span style={{ color: "red" }}>{errors.weight}</span>
                    )}
                  </Form.Field>
                </Form.Group>

                <br />

                <Form.Field error={touched.houseaddr && errors.houseaddr}>
                  <Form.Group widths="equal">
                    <Form.TextArea
                      label="House Address"
                      placeholder="Eg. 310 Nguyen Van Cu, Hoa Khanh, Da nang"
                      name="houseaddr"
                      value={values.houseaddr}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  {touched.houseaddr && errors.houseaddr && (
                    <span style={{ color: "red" }}>{errors.houseaddr}</span>
                  )}
                </Form.Field>

                <br />
                <h2 style={{ marginTop: "20px", marginBottom: "30px" }}>
                  Medical History
                </h2>
                <Divider clearing />
                <Form.Group widths="equal">
                  <Form.Field error={touched.bloodgroup && errors.bloodgroup}>
                    <label>Blood Group</label>
                    <Input
                      placeholder="Eg. A-"
                      name="bloodgroup"
                      value={values.bloodgroup}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.bloodgroup && errors.bloodgroup && (
                      <span style={{ color: "red" }}>{errors.bloodgroup}</span>
                    )}
                  </Form.Field>

                  <Form.Field error={touched.allergies && errors.allergies}>
                    <label>Allergies</label>
                    <Select
                      name="allergies"
                      options={allergyOptions}
                      value={values.allergies}
                      onChange={(_, { value }) =>
                        handleChange({ target: { name: "allergies", value } })
                      }
                    />
                    {touched.allergies && errors.allergies && (
                      <span style={{ color: "red" }}>{errors.allergies}</span>
                    )}
                  </Form.Field>
                </Form.Group>

                <br />
                <Form.Field error={touched.allergies && errors.allergies}>
                  <Form.Group widths="equal">
                    <Form.TextArea
                      label="Current Medications"
                      placeholder="Eg. Antidepressants"
                      name="medication"
                      value={values.medication}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  {touched.medication && errors.medication && (
                    <span style={{ color: "red" }}>{errors.medication}</span>
                  )}
                </Form.Field>

                <br />
                <h2 style={{ marginTop: "20px", marginBottom: "30px" }}>
                  Emergency Contact
                </h2>
                <Divider clearing />
                <Form.Group widths="equal">
                  <Form.Field
                    error={touched.emergencyName && errors.emergencyName}
                  >
                    <label>Emergency Contact Name</label>
                    <Input
                      placeholder="Eg. Taylor Smith"
                      name="emergencyName"
                      value={values.emergencyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.emergencyName && errors.emergencyName && (
                      <span style={{ color: "red" }}>
                        {errors.emergencyName}
                      </span>
                    )}
                  </Form.Field>

                  <Form.Field
                    error={touched.emergencyContact && errors.emergencyContact}
                  >
                    <label>Emergency Contact Phone</label>
                    <Input
                      placeholder="Eg. 0124995002"
                      name="emergencyContact"
                      value={values.emergencyContact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.emergencyContact && errors.emergencyContact && (
                      <span style={{ color: "red" }}>
                        {errors.emergencyContact}
                      </span>
                    )}
                  </Form.Field>
                </Form.Group>

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

export default RegisterPatient;
