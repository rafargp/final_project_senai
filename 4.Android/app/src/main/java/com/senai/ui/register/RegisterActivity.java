package com.senai.ui.register;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.senai.R;
import com.senai.data.model.LoggedInUser;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {
    RegisterViewModel registerViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        registerViewModel = ViewModelProviders.of(this, new RegisterViewModelFactory()).get(RegisterViewModel.class);

        final EditText username = findViewById(R.id.register_username);
        final EditText password = findViewById(R.id.register_password);
        final Button submit = findViewById(R.id.register_submit);
        final ProgressBar progressBar = findViewById(R.id.register_loading);

        progressBar.setVisibility(View.INVISIBLE);

        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                progressBar.setVisibility(View.VISIBLE);
                registerViewModel.register(username.getText().toString(),password.getText().toString(),registerCallback());
            }
        });

        registerViewModel.getRegisterFormState().observe(this, new Observer<RegisterFormState>() {
            @Override
            public void onChanged(@Nullable RegisterFormState registerFormState) {
                if (registerFormState == null) return;
                submit.setEnabled(registerFormState.isDataValid());
                if (registerFormState.getUsernameError() != null) {
                    username.setError(getString(registerFormState.getUsernameError()));
                }
                if (registerFormState.getPasswordError() != null) {
                    password.setError(getString(registerFormState.getPasswordError()));
                }
            }
        });

        registerViewModel.getRegisterResult().observe(this, new Observer<RegisterResult>() {
            @Override
            public void onChanged(@Nullable RegisterResult registerResult) {
                if (registerResult == null) return;
                progressBar.setVisibility(View.GONE);
                if (registerResult.getError() != null) showRegisterFailed(registerResult.getError());
                if (registerResult.getSuccess()) updateUiWithUser();
                setResult(Activity.RESULT_OK);
            }
        });

        TextWatcher afterTextChangedListener = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // ignore
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // ignore
            }

            @Override
            public void afterTextChanged(Editable s) {
                registerViewModel.registerDataChanged(username.getText().toString(),password.getText().toString());
            }
        };

        username.addTextChangedListener(afterTextChangedListener);
        password.addTextChangedListener(afterTextChangedListener);
    }
    public Callback<LoggedInUser> registerCallback(){
        final ProgressBar progressBar = findViewById(R.id.register_loading);

        return new Callback<LoggedInUser>() {
            @Override
            public void onResponse(Call<LoggedInUser> call, Response<LoggedInUser> response) {
                progressBar.setVisibility(View.INVISIBLE);
                Toast.makeText(getApplicationContext(),"Cadastro com sucesso!",Toast.LENGTH_SHORT);
                Intent returnIntent = new Intent();
                returnIntent.putExtra("username","rafargp@yahoo.com.br");
                setResult(Activity.RESULT_OK,returnIntent);
                finish();
            }
            @Override
            public void onFailure(Call<LoggedInUser> call, Throwable t) {
                progressBar.setVisibility(View.INVISIBLE);
            }
        };
    }

    private void updateUiWithUser() {

    }

    private void showRegisterFailed(@StringRes Integer errorString) {
        Toast.makeText(getApplicationContext(), errorString, Toast.LENGTH_LONG).show();
    }


}