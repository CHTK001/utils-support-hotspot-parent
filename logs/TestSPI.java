import java.net.URL;
import java.net.URLClassLoader;
import java.io.File;
import java.util.Enumeration;

public class TestSPI {
    public static void main(String[] args) throws Exception {
        File f = new File(args[0]);
        URLClassLoader cl = new URLClassLoader(new URL[]{f.toURI().toURL()}, TestSPI.class.getClassLoader());
        Enumeration<URL> res = cl.getResources("META-INF/hotspot-plugins/com.chua.hotspot.core.support.plugin.PluginRegistration");
        int count = 0;
        while (res.hasMoreElements()) {
            URL u = res.nextElement();
            System.out.println("FOUND: " + u);
            count++;
        }
        System.out.println("Total: " + count);
    }
}