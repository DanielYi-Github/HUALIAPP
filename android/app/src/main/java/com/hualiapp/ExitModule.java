package com.hualiapp;
 
import androidx.annotation.NonNull;
 
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
 
public class ExitModule extends ReactContextBaseJavaModule {
 
   private static ReactApplicationContext reactContext;
 
   public ExitModule(ReactApplicationContext reactContext) {
       super(reactContext);
       this.reactContext = reactContext;
   }
 
   @ReactMethod
   public void exit() {
       android.os.Process.killProcess(android.os.Process.myPid());
   }
 
   /* Here create multiple ReactMethod */
 
   @NonNull
   @Override
   public String getName() {
       return "ExitApp";
   }
}
