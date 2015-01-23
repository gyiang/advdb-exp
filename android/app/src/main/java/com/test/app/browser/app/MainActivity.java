package com.test.app.browser.app;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.text.Layout;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;


public class MainActivity extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_PROGRESS);
        setContentView(R.layout.main);
        final WebView webView=(WebView)findViewById(R.id.browser);
        final EditText text=(EditText)findViewById(R.id.url);
        final Button go=(Button)findViewById(R.id.go);
        final LinearLayout layout=(LinearLayout)findViewById(R.id.gol);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                text.setText(url);
                super.onPageStarted(view, url, favicon);
            }
        });
        webView.setWebChromeClient(new WebChromeClient(){

           @Override
            public boolean onJsConfirm(WebView view, String url, String message,
                                       final JsResult result) {
                AlertDialog.Builder b = new AlertDialog.Builder(MainActivity.this);
                b.setTitle("Confirm");
                b.setMessage(message);
                b.setPositiveButton(android.R.string.ok,
                        new AlertDialog.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                result.confirm();
                            }
                        });
                b.setNegativeButton(android.R.string.cancel,
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                result.cancel();
                            }
                        });
                b.setCancelable(false);
                b.create();
                b.show();
                return true;
            };

            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                MainActivity.this.getWindow().setFeatureInt(Window.FEATURE_PROGRESS, newProgress * 100);
                super.onProgressChanged(view, newProgress);
            }

            @Override
            public void onReceivedTitle(WebView view, String title) {
                MainActivity.this.setTitle(title);
                super.onReceivedTitle(view, title);
            }
        });
        go.setOnClickListener(new View.OnClickListener(){
            public void onClick(View view) {
                String url="http://"+text.getText().toString()+":3000";
                webView.loadUrl(url);
                layout.setVisibility(View.GONE);
            }
        });
        //webView.loadUrl("http://localhost:3000");
    }
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        WebView mWebView=(WebView)findViewById(R.id.browser);
        if ((keyCode == KeyEvent.KEYCODE_BACK) && mWebView.canGoBack()) {
            mWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
