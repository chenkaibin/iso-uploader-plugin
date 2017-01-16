package org.ovirtChina.enginePlugin.isoUploaderPlugin;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.Writer;
import java.io.FileWriter;

public class CommandExecuter {

    private String lineAskingPassword = "Please provide the REST API password for the admin@internal oVirt Engine user (CTRL+D to abort):";

    public CommandExecuter() {}

  /**
  * Execute and return a Response for the command list
  */
  public void list(String IsoUploadName,String useIsoName){

      System.out.println("Execute function ovirt-iso-uploader list");

      String isonameinfo = executeCommand("ovirt-iso-uploader list");

      System.out.println("End of the execution of the function ovirt-iso-uploader list");

      String isoname = useIsoName;

      System.out.println("Execute function ovirt-iso-uploader upload");

      String ovirtuploadername = "ovirt-iso-uploader --iso-domain=" + isoname + " upload ./uploads/" + IsoUploadName + ";rm -rf ./uploads/" + IsoUploadName;

      System.out.println(ovirtuploadername);

      executeCommandisoupload(ovirtuploadername);

      System.out.println(IsoUploadName + " is completed.");

  }

  /**
  * Execute and return a Response for the command upload
  */
  public void upload(){

  }

  /**
  * Execute command
  */
    private String executeCommand(String command) {
        System.out.println("Executing command: " + command);

        String[] commands = new String[]{"/bin/sh","-c",command};

        StringBuffer outputBuf = new StringBuffer();

        try {
            ProcessBuilder builder = new ProcessBuilder(commands);
            builder.redirectErrorStream(true);
            Process p = builder.start();

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(p.getOutputStream()));

            writer.write( "abc123\n" );

            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line = "";

            line = reader.readLine();
            System.out.println(line);

            while ((line = reader.readLine())!= null) {
                outputBuf.append(line + "\n");

                System.out.println("New Output is: " + line);
                if (line.contains(lineAskingPassword)){
                    System.out.println("CLI requests password");
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        }
 
        System.out.println("Output: " + outputBuf.toString().trim());
        return outputBuf.toString().trim();
    }

    private void executeCommandisoupload(String command1) {

            System.out.println("Executing command: " + command1);

            String[] commands1 = new String[]{"/bin/sh","-c",command1};
            try {
                ProcessBuilder builder1 = new ProcessBuilder(commands1);
                builder1.redirectErrorStream(true);
                Process p1 =builder1.start();
                //BufferedWriter writer1 = new BufferedWriter(new OutputStreamWriter(p1.getOutputStream()));
                BufferedReader reader1 = new BufferedReader(new InputStreamReader(p1.getInputStream()));
                String line1 = "";
                line1 = reader1.readLine();
                System.out.println(line1);
            } catch (Exception e) {
                e.printStackTrace();
            }

            System.out.println("End of the execution of the function ovirt-iso-uploader upload");
    }

    public void executeRemoveTempDir(String rmTempDirCommand) {
            System.out.println("Executing command: " + rmTempDirCommand);
            String[] rmTempDir = new String[]{"/bin/sh","-c",rmTempDirCommand};
            try {
                ProcessBuilder builderRm = new ProcessBuilder(rmTempDir);
                builderRm.redirectErrorStream(true);
                Process pRm =builderRm.start();
            }catch (Exception e) {
                e.printStackTrace();
            }
    }
    
    public String executeRemoveDir(String rmCommand) {
            System.out.println("Executing command: " + rmCommand);

            String[] rmCommands = new String[]{"/bin/sh","-c",rmCommand};
            try {
                ProcessBuilder builderRm = new ProcessBuilder(rmCommands);
                builderRm.redirectErrorStream(true);
                Process pRm =builderRm.start();
                BufferedReader reader1 = new BufferedReader(new InputStreamReader(pRm.getInputStream()));
                String line1 = "";
                line1 = reader1.readLine();
                System.out.println(line1);
                if(line1.indexOf("ERROR")!=-1){
                    return line1;
                }else{
                    return "success";
                }
            }catch (Exception e) {
                e.printStackTrace();
                return e.getMessage();
            }
    }
}
