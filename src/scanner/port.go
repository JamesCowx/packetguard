package scanner
import ("fmt";"net";"time")
type PortResult struct { Port int `json:"port"`; Service string `json:"service"`; State string `json:"state"`; Protocol string `json:"protocol"`
func ScanPort(host string, port int, protocol string, timeout time.Duration) PortResult {
  address := fmt.Sprintf("%s:%d", host, port)
  conn, err := net.DialTimeout(protocol, address, timeout)
  if err != nil { return PortResult{Port: port, State: "closed", Protocol: protocol} }
  defer conn.Close()
  service := getServiceName(port)
  return PortResult{Port: port, Service: service, State: "open", Protocol: protocol}
}
func ScanRange(host string, start, end int, timeout time.Duration) []PortResult {
  var results []PortResult
  for port := start; port <= end; port++ { results = append(results, ScanPort(host, port, "tcp", timeout)) }
  return results
}
func getServiceName(port int) string {
  services := map[int]string{22: "SSH", 80: "HTTP", 443: "HTTPS", 3306: "MySQL", 5432: "PostgreSQL", 6379: "Redis", 8080: "HTTP-Alt"}
  if name, ok := services[port]; ok { return name }; return "unknown"
}
