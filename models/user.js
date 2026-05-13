const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ✅ Existing fields (touch करू नका)
    fullName:           { type: String, trim: true },
    userName:           { type: String, trim: true },
    firstName:          { type: String, trim: true },
    lastName:           { type: String, trim: true },
    mobileNumber:       { type: String, trim: true },
    email:              { type: String, trim: true },
    lookingFor:         { type: String, trim: true },
    password:           { type: String },
    role:               { type: String, default: "" },
    departmentName:     { type: String },
    office:             { type: String },
    departmentCategory: { type: String },

    // ✅ Step 1 — Basic Info
    dob:          { type: String },
    gender:       { type: String },
    maritalStatus:{ type: String },
    profileFor:   { type: String },
    height:       { type: String },
    weight:       { type: String },
    bodyType:     { type: String },
    complexion:   { type: String },
    mobile:       { type: String },
    about:        { type: String },

    // ✅ Step 2 — Personal
    motherTongue: { type: String },
    nationality:  { type: String },
    country:      { type: String },
    currentState: { type: String },
    currentCity:  { type: String },
    birthCity:    { type: String },
    birthTime:    { type: String },
    rashi:        { type: String },
    nakshatra:    { type: String },
    gotra:        { type: String },
    manglik:      { type: String },

    // ✅ Step 3 — Religion
    religion:          { type: String },
    caste:             { type: String },
    subCaste:          { type: String },
    casteNoBar:        { type: String },
    religiousPractice: { type: String },
    community:         { type: String },

    // ✅ Step 4 — Family
    fatherName:       { type: String },
    fatherOccupation: { type: String },
    motherName:       { type: String },
    motherOccupation: { type: String },
    brothers:         { type: String },
    brothersMarried:  { type: String },
    sisters:          { type: String },
    sistersMarried:   { type: String },
    familyType:       { type: String },
    familyValues:     { type: String },
    familyStatus:     { type: String },
    familyLocation:   { type: String },

    // ✅ Step 5 — Education
    education:      { type: String },
    fieldOfStudy:   { type: String },
    college:        { type: String },
    employmentType: { type: String },
    occupation:     { type: String },
    company:        { type: String },
    income:         { type: String },
    workLocation:   { type: String },

    // ✅ Step 6 — Lifestyle
    diet:      { type: String },
    smoking:   { type: String },
    drinking:  { type: String },
    fitness:   { type: String },
    languages: [{ type: String }],
    hobbies:   [{ type: String }],
    vehicle:   { type: String },
    property:  { type: String },

    // ✅ Step 7 — Partner Prefs
    partnerAgeMin:        { type: String },
    partnerAgeMax:        { type: String },
    partnerHeightMin:     { type: String },
    partnerHeightMax:     { type: String },
    partnerMaritalStatus: { type: String },
    partnerReligion:      { type: String },
    partnerCaste:         { type: String },
    partnerEducation:     { type: String },
    partnerIncome:        { type: String },
    partnerLocation:      { type: String },
    partnerDiet:          { type: String },
    partnerManglik:       { type: String },
    partnerDesc:          { type: String },

    // ✅ Step 8 — Photos
    photos:   [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);