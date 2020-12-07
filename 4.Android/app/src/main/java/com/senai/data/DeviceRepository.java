package com.senai.data;

import com.senai.data.model.Device;
import com.senai.data.model.Device_Data;

import java.util.List;

import retrofit2.Callback;

public class DeviceRepository {

    private static volatile DeviceRepository instance;

    private DeviceDataSource dataSource;

    private DeviceRepository(DeviceDataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static DeviceRepository getInstance(DeviceDataSource dataSource) {
        if (instance == null) instance = new DeviceRepository(dataSource);
        return instance;
    }

    public void list_available(Callback<List<Device>> callback,Integer code) {
        dataSource.list_available(callback,code);
    }
    public void list_user_devices(Callback<List<Device>> callback,int user_id) {
        dataSource.list_user_devices(callback,user_id);
    }
    public void list_data(int id, Callback<List<Device_Data>> callback) {
        dataSource.list_data(id, callback);
    }


}