package com.senai.data;

import androidx.annotation.Nullable;

import com.senai.data.model.Device;
import com.senai.data.model.Device_Data;
import com.senai.data.network.RetrofitClientInstance;
import com.senai.service.DeviceDataService;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;

public class DeviceDataSource {

    private DeviceDataService service;

    public DeviceDataSource(){
        service = RetrofitClientInstance.getRetrofitInstance().create(DeviceDataService.class);
    }

    public void list_available(Callback<List<Device>> callback, Integer code) {
        try {

            if(code != null) {
                Call<List<Device>> call = service.list_available(code);
                call.enqueue(callback);
            }else{
                Call<List<Device>> call = service.list_available();
                call.enqueue(callback);
            }
        } catch (Exception e) {

        }
    }
    public void list_user_devices(Callback<List<Device>> callback,int user_id) {
        try {
            Call<List<Device>> call = service.list_user_devices(user_id);
            call.enqueue(callback);
        } catch (Exception e) {

        }
    }
    public void list_data(int device_id, Callback<List<Device_Data>> callback) {
        try {
            Call<List<Device_Data>> call = service.list_data(device_id);
            call.enqueue(callback);
        } catch (Exception e) {

        }
    }
}