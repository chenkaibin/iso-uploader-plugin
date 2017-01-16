package org.ovirtChina.enginePlugin.isoUploaderPlugin;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ovirtChina.enginePlugin.isoUploaderPlugin.CommandExecuter;

/**
 * Servlet implementation class RemoveFile
 */
public class RemoveFile extends HttpServlet {
    private static final long serialVersionUID = 1L;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RemoveFile() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
           String isoDomainName = request.getParameter("domainName");
           String isoName = request.getParameter("isoName");
           CommandExecuter cmdExe = new CommandExecuter();
        
           String ovirtuploadername = "ovirt-iso-uploader --iso-domain=" + isoDomainName + " delete " + isoName ;
        
           System.out.println("Execute function ovirt-iso-uploader remove_file");
           String result = cmdExe.executeRemoveDir(ovirtuploadername);
           if(result!=null && "success".equals(result)){
               System.out.println("[" +isoName+ "]file has been removed.");
               response.getWriter().print("1");
           }else{
               //System.out.println("unable to remove file [" +isoDomainName +"]");
               response.getWriter().print(result);
           }
    }

}
