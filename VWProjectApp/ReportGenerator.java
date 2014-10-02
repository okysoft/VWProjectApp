
import javax.websocket.OnMessage;
import javax.websocket.server.ServerEndpoint;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Intarget
 */
@ServerEndpoint("/endpoint")
public class ReportGenerator {

    @OnMessage
    public String onMessage(String message) {
        return null;
    }
    
}
