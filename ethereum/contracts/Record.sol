// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Record {
    struct Patients {
        string ic;
        string name;
        string phone;
        string gender;
        string dob;
        string height;
        string weight;
        string houseaddr;
        string bloodgroup;
        string allergies;
        string medication;
        string emergencyName;
        string emergencyContact;
        address addr;
        uint date;
    }

    struct Doctors {
        string ic;
        string name;
        string phone;
        string gender;
        string dob;
        string qualification;
        string major;
        address addr;
        uint date;
    }

    struct AppointmentDetails {
        string date;
        string time;
        string prescription;
        string description;
        string diagnosis;
        string status;
    }

    struct Appointments {
        address doctoraddr;
        address patientaddr;
        string date;
        string time;
        string prescription;
        string description;
        string diagnosis;
        string status;
        uint creationDate;
    }

    struct PatientUpdate {
        string ic;
        string name;
        string phone;
        string gender;
        string dob;
        string height;
        string weight;
        string houseaddr;
        string bloodgroup;
        string allergies;
        string medication;
        string emergencyName;
        string emergencyContact;
    }

    address public owner;
    address[] public patientList;
    address[] public doctorList;
    address[] public appointmentList;

    mapping(address => Patients) public patients;
    mapping(address => Doctors) doctors;
    mapping(address => Appointments) appointments;

    mapping(address => mapping(address => bool)) isApproved;
    mapping(address => bool) isPatient;
    mapping(address => bool) isDoctor;
    mapping(address => uint) AppointmentPerPatient;

    uint256 public patientCount = 0;
    uint256 public doctorCount = 0;
    uint256 public appointmentCount = 0;
    uint256 public permissionGrantedCount = 0;

    constructor() {
        owner = msg.sender;
    }

    // Add patient details
   function setDetails(
    string memory _ic,
    string memory _name,
    string memory _phone,
    string memory _gender,
    string memory _dob,
    string memory _height,
    string memory _weight,
    string memory _houseaddr,
    string memory _bloodgroup,
    string memory _allergies,
    string memory _medication,
    string memory _emergencyName,
    string memory _emergencyContact
) public {
    //require(!isPatient[msg.sender], "Already a registered patient");

    Patients memory patient = Patients({
        ic: _ic,
        name: _name,
        phone: _phone,
        gender: _gender,
        dob: _dob,
        height: _height,
        weight: _weight,
        houseaddr: _houseaddr,
        bloodgroup: _bloodgroup,
        allergies: _allergies,
        medication: _medication,
        emergencyName: _emergencyName,
        emergencyContact: _emergencyContact,
        addr: msg.sender,
        date: block.timestamp
    });

    patients[msg.sender] = patient;
    patientList.push(msg.sender);
    isPatient[msg.sender] = true;
    isApproved[msg.sender][msg.sender] = true;
    patientCount++;
}


    // Edit patient details
   function editDetails(
    string memory _ic,
    string memory _name,
    string memory _phone,
    string memory _gender,
    string memory _dob,
    string memory _height,
    string memory _weight,
    string memory _houseaddr,
    string memory _bloodgroup,
    string memory _allergies,
    string memory _medication,
    string memory _emergencyName,
    string memory _emergencyContact
) public {
    require(isPatient[msg.sender], "Not a registered patient");

    Patients storage p = patients[msg.sender];
    p.ic = _ic;
    p.name = _name;
    p.phone = _phone;
    p.gender = _gender;
    p.dob = _dob;
    p.height = _height;
    p.weight = _weight;
    p.houseaddr = _houseaddr;
    p.bloodgroup = _bloodgroup;
    p.allergies = _allergies;
    p.medication = _medication;
    p.emergencyName = _emergencyName;
    p.emergencyContact = _emergencyContact;
}


    // Add doctor details
    function setDoctor(string memory _ic, string memory _name, string memory _phone, string memory _gender, string memory _dob, string memory _qualification, string memory _major) public {
        require(!isDoctor[msg.sender], "Already a registered doctor");

        Doctors storage d = doctors[msg.sender];
        d.ic = _ic;
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.dob = _dob;
        d.qualification = _qualification;
        d.major = _major;
        d.addr = msg.sender;
        d.date = block.timestamp;

        doctorList.push(msg.sender);
        isDoctor[msg.sender] = true;
        doctorCount++;
    }

    // Edit doctor details
    function editDoctor(string memory _ic, string memory _name, string memory _phone, string memory _gender, string memory _dob, string memory _qualification, string memory _major) public {
        require(isDoctor[msg.sender], "Not a registered doctor");

        Doctors storage d = doctors[msg.sender];
        d.ic = _ic;
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.dob = _dob;
        d.qualification = _qualification;
        d.major = _major;
    }

    // Add appointment
    function setAppointment(address _addr, AppointmentDetails memory details) public {
        require(isDoctor[msg.sender], "Only doctors can create appointments");

        Appointments storage a = appointments[_addr];
        a.doctoraddr = msg.sender;
        a.patientaddr = _addr;
        a.date = details.date;
        a.time = details.time;
        a.diagnosis = details.diagnosis;
        a.prescription = details.prescription;
        a.description = details.description;
        a.status = details.status;
        a.creationDate = block.timestamp;

        appointmentList.push(_addr);
        appointmentCount++;
        AppointmentPerPatient[_addr]++;
    }

    // Update appointment
    function updateAppointment(address _addr, AppointmentDetails memory details) public {
        require(isDoctor[msg.sender], "Only doctors can update appointments");

        Appointments storage a = appointments[_addr];
        a.date = details.date;
        a.time = details.time;
        a.diagnosis = details.diagnosis;
        a.prescription = details.prescription;
        a.description = details.description;
        a.status = details.status;
    }

    // Give permission
    function givePermission(address _address) public returns (bool success) {
        isApproved[msg.sender][_address] = true;
        permissionGrantedCount++;
        return true;
    }

    // Revoke permission
    function revokePermission(address _address) public returns (bool success) {
        isApproved[msg.sender][_address] = false;
        return true;
    }

    // Get patient list
    function getPatients() public view returns (address[] memory) {
        return patientList;
    }

    // Get doctor list
    function getDoctors() public view returns (address[] memory) {
        return doctorList;
    }

    // Get appointment list
    function getAppointments() public view returns (address[] memory) {
        return appointmentList;
    }

    // Search patient demographic details
    function searchPatientDemographic(address _address) public view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(isApproved[_address][msg.sender], "Access denied");

        Patients memory p = patients[_address];
        return (p.ic, p.name, p.phone, p.gender, p.dob, p.height, p.weight);
    }

    // Search patient medical details
    function searchPatientMedical(address _address) public view returns (string memory, string memory, string memory, string memory, string memory, string memory) {
        require(isApproved[_address][msg.sender], "Access denied");

        Patients memory p = patients[_address];
        return (p.houseaddr, p.bloodgroup, p.allergies, p.medication, p.emergencyName, p.emergencyContact);
    }

    // Search doctor details
    function searchDoctor(address _address) public view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(isDoctor[_address], "Not a registered doctor");

        Doctors memory d = doctors[_address];
        return (d.ic, d.name, d.phone, d.gender, d.dob, d.qualification, d.major);
    }

    // Search appointment details
    function searchAppointment(address _address) public view returns (address, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        Appointments memory a = appointments[_address];
        Doctors memory d = doctors[a.doctoraddr];

        return (a.doctoraddr, d.name, a.date, a.time, a.diagnosis, a.prescription, a.description, a.status);
    }

    // Search patient record creation date
    function searchRecordDate(address _address) public view returns (uint) {
        Patients memory p = patients[_address];
        return (p.date);
    }

    // Search doctor profile creation date
    function searchDoctorDate(address _address) public view returns (uint) {
        Doctors memory d = doctors[_address];
        return (d.date);
    }

    // Search appointment creation date
    function searchAppointmentDate(address _address) public view returns (uint) {
        Appointments memory a = appointments[_address];
        return (a.creationDate);
    }

    // Get patient count
    function getPatientCount() public view returns (uint256) {
        return patientCount;
    }

    // Get doctor count
    function getDoctorCount() public view returns (uint256) {
        return doctorCount;
    }

    // Get appointment count
    function getAppointmentCount() public view returns (uint256) {
        return appointmentCount;
    }

    // Get permission granted count
    function getPermissionGrantedCount() public view returns (uint256) {
        return permissionGrantedCount;
    }

    // Get appointments per patient
    function getAppointmentPerPatient(address _address) public view returns (uint256) {
        return AppointmentPerPatient[_address];
    }
}