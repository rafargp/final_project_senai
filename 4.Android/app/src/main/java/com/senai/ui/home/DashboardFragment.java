package com.senai.ui.home;

import android.os.Bundle;

import androidx.appcompat.view.ActionMode;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.senai.R;
import com.senai.data.model.Device_Data;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DashboardFragment extends Fragment {


    private View view;
    private ProgressBar progressBar;
    private DeviceViewModel deviceViewModel;
    private TextView textView;

    public DashboardFragment() {
    }

    public static DashboardFragment newInstance() {
        DashboardFragment fragment = new DashboardFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {}
        deviceViewModel = ViewModelProviders.of(this, new DeviceViewModelFactory()).get(DeviceViewModel.class);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_dashboard, container, false);
        deviceViewModel.list_data(1,listDataCallback());
        progressBar = view.findViewById(R.id.dashboard_loading);
        progressBar.setVisibility(View.VISIBLE);
        textView = view.findViewById(R.id.dashboard_text_log);
        return view;
    }

    public Callback<List<Device_Data>> listDataCallback(){
        return new Callback<List<Device_Data>>() {
            @Override
            public void onResponse(Call<List<Device_Data>> call, Response<List<Device_Data>> response) {
                progressBar.setVisibility(View.INVISIBLE);
                String out = "";
                for (Device_Data item:response.body()) {
                    out += String.format("%s | %s | %s | %tD\n",item.getSensor(),item.getData_type(),item.getData_value(),item.getDate());
                }
                textView.setText(out);
            }

            @Override
            public void onFailure(Call<List<Device_Data>> call, Throwable t) {
                progressBar.setVisibility(View.INVISIBLE);
            }
        };
    }
}