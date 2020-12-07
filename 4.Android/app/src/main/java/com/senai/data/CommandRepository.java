package com.senai.data;

import retrofit2.Callback;

public class CommandRepository {

    private static volatile CommandRepository instance;

    private CommandDataSource dataSource;

    private CommandRepository(CommandDataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static CommandRepository getInstance(CommandDataSource dataSource) {
        if (instance == null) instance = new CommandRepository(dataSource);
        return instance;
    }

    public void toggle_led(Callback<String> callback) {
        dataSource.toggle_led(callback);
    }
    public void water_bomb(Callback<String> callback) {
        dataSource.water_bomb(callback);
    }
    public void is_alive(Callback<String> callback) {
        dataSource.is_alive(callback);
    }

}