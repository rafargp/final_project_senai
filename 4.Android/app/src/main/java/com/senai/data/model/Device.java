package com.senai.data.model;

import com.google.gson.annotations.SerializedName;

import java.util.Arrays;
import java.util.List;

public class Device {
    @SerializedName("Code")
    private int code;
    @SerializedName("Version")
    private String version;
    @SerializedName("Hardware")
    private String hardware;
    @SerializedName("Mode")
    private Device_Mode mode;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getHardware() {
        return hardware;
    }

    public void setHardware(String hardware) {
        this.hardware = hardware;
    }

    public Device_Mode getMode() {
        if(mode == null) return Device_Mode.UNDEFINED;
        return mode;
    }

    public void setMode(Device_Mode mode) {
        this.mode = mode;
    }

    public String getVersion() {
        return "V "+ version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public static class DeviceBuilder {
        public DeviceBuilder setCode(int code) {
            this.code = code;
            return this;
        }

        public DeviceBuilder setVersion(String version) {
            this.version = version;
            return this;
        }

        public DeviceBuilder setHardware(String hardware) {
            this.hardware = hardware;
            return this;
        }

        public DeviceBuilder setMode(Device_Mode mode) {
            this.mode = mode;
            return this;
        }

        private int code;
        private String version;
        private String hardware;
        private Device_Mode mode;

        private DeviceBuilder(){}

        public static DeviceBuilder builder(){
            return new DeviceBuilder();
        }
        public Device build(){
            Device device = new Device();
            device.code = code;
            device.hardware = hardware;
            device.mode = mode;
            device.version = version;
            return device;
        }
    }

    public static List<Device> fakeDevices(){
        return Arrays.asList(
                DeviceBuilder.builder().setCode(1).setHardware("ESP32").setMode(Device_Mode.LEARN).setVersion("1.0").build(),
                DeviceBuilder.builder().setCode(2).setHardware("ESP8266").setMode(Device_Mode.AUTO).setVersion("2.0").build(),
                DeviceBuilder.builder().setCode(3).setHardware("Arduino").setMode(Device_Mode.LEARN).setVersion("3.0").build(),
                DeviceBuilder.builder().setCode(4).setHardware("ESP32").setMode(Device_Mode.AUTO).setVersion("4.0").build(),
                DeviceBuilder.builder().setCode(5).setHardware("ESP8266").setMode(Device_Mode.LEARN).setVersion("5.0").build()
        );
    }
}
