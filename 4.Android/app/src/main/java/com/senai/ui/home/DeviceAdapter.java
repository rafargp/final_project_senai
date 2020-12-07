package com.senai.ui.home;

import android.util.SparseBooleanArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.senai.R;
import com.senai.data.model.Device;

import java.util.ArrayList;

public class DeviceAdapter extends RecyclerView.Adapter<DeviceAdapter.DeviceViewHolder> {
    private final ArrayList<Device> devices;
    private DeviceAdapaterListener listener;
    final SparseBooleanArray selectedItems = new SparseBooleanArray();
    private int currentSelectedPos;

    public void setListener(DeviceAdapaterListener listener) {
        this.listener = listener;
    }

    public ArrayList<Device> getDevices() {
        return devices;
    }

    public DeviceAdapter(ArrayList<Device> deviceArrayList) {
        this.devices = deviceArrayList;
    }

    @NonNull
    @Override
    public DeviceViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_device_item,parent,false);
        return new DeviceViewHolder(view);
    }

    @Override
    public int getItemCount() {
        return devices.size();
    }

    @Override
    public void onBindViewHolder(@NonNull DeviceViewHolder holder, final int position) {
        Device device = devices.get(position);
        holder.bind(device);
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(selectedItems.size() > 0 && listener != null){
                    listener.onItemClick(position);
                }
            }
        });
        holder.itemView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                if(listener != null) listener.onItemLongClick(position);
                return true;
            }
        });
        if(currentSelectedPos == position) currentSelectedPos = -1;
    }

    class DeviceViewHolder extends RecyclerView.ViewHolder {

        TextView txtDeviceName;
        TextView txtDeviceVersion;
        TextView txtDeviceMode;
        TextView txtDeviceCode;

        public DeviceViewHolder(@NonNull View itemView) {
            super(itemView);
            txtDeviceName = itemView.findViewById(R.id.device_name);
            txtDeviceVersion = itemView.findViewById(R.id.device_version);
            txtDeviceMode = itemView.findViewById(R.id.device_mode);
            txtDeviceCode = itemView.findViewById(R.id.device_code);
        }

        public void bind(Device device) {
            txtDeviceName.setText(device.getHardware());
            txtDeviceVersion.setText(device.getVersion());
            txtDeviceMode.setText(device.getMode().toString());
            txtDeviceCode.setText(String.valueOf(device.getCode()));
        }
    }
    interface DeviceAdapaterListener {
        void onItemClick(int position);
        void onItemLongClick(int position);
    }
}
