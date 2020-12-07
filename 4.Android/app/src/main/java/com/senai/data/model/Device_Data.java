package com.senai.data.model;

import com.google.gson.annotations.SerializedName;

import java.util.Date;

public class Device_Data {
    public String getDevice_id() {
        return device_id;
    }

    public void setDevice_id(String device_id) {
        this.device_id = device_id;
    }

    public String getSensor() {
        return sensor;
    }

    public void setSensor(String sensor) {
        this.sensor = sensor;
    }

    public String getData_value() {
        return data_value;
    }

    public void setData_value(String data_value) {
        this.data_value = data_value;
    }

    public String getData_type() {
        return data_type;
    }

    public void setData_type(String data_type) {
        this.data_type = data_type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @SerializedName("Device_Id")
    private String device_id;
    @SerializedName("Sensor")
    private String sensor;
    @SerializedName("Data_Value")
    private String data_value;
    @SerializedName("Data_Type")
    private String data_type;
    @SerializedName("Date")
    private Date date;
}
