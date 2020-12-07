package com.senai.ui.home;

import androidx.lifecycle.ViewModel;

import com.senai.data.DeviceRepository;
import com.senai.data.model.Device;
import com.senai.data.model.Device_Data;

import java.util.List;

import retrofit2.Callback;

public class DeviceViewModel extends ViewModel {
    private DeviceRepository deviceRepository;

    public DeviceViewModel(DeviceRepository deviceRepository){
        this.deviceRepository = deviceRepository;
    }
    public void list_user_devices(Callback<List<Device>> callback,int user_id){
        deviceRepository.list_user_devices(callback,user_id);
    }
    public void list_available(Callback<List<Device>> callback,Integer code){
        deviceRepository.list_available(callback,code);
    }
    public void list_data(int id, Callback<List<Device_Data>> callback){
        deviceRepository.list_data(id,callback);
    }
}
