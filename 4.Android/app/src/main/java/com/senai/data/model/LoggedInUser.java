package com.senai.data.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class LoggedInUser {
    @SerializedName("Id")
    private Integer id;
    @SerializedName("Username")
    private String displayName;

    public LoggedInUser(int id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    public Integer getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

}