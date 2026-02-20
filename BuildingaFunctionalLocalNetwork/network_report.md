**Network Design Report — Small Company Floor**

**Scope**
- 1 router with internet access
- 2 switches
- 4 employee PCs (wired)
- 1 printer (wired)
- 1 Wi‑Fi access point with 2 wireless devices

**Overview**
This document contains: MAC assignments, Ethernet frame structure, collision handling, IP addressing/subnetting, DHCP role, and packet routing/NAT explanation with a packet path example.

**Part 1: MAC & Frame Handling**

- **Assigned MACs:**
  - **Router (LAN interface):** 00:1A:2B:3C:4D:01
  - **Switch 1 (mgmt):** 00:1A:2B:3C:4D:02 (optional)
  - **Switch 2 (mgmt):** 00:1A:2B:3C:4D:03 (optional)
  - **Access Point (wired mgmt / MAC for radio):** 00:1A:2B:3C:4D:04
  - **PC1:** 00:1A:2B:3C:4D:11
  - **PC2:** 00:1A:2B:3C:4D:12
  - **PC3:** 00:1A:2B:3C:4D:13
  - **PC4:** 00:1A:2B:3C:4D:14
  - **Printer:** 00:1A:2B:3C:4D:20
  - **Wireless Device A:** 00:1A:2B:3C:4D:A1
  - **Wireless Device B:** 00:1A:2B:3C:4D:A2

- **Notes on MACs:** Use EUI-48 format (six octets). These are locally-assigned examples; in production use vendor-assigned MACs.

- **Ethernet Frame Structure (PC -> Printer on same LAN):**
  - Preamble (7 bytes) + Start Frame Delimiter (1 byte)
  - Destination MAC (6 bytes): printer MAC = 00:1A:2B:3C:4D:20
  - Source MAC (6 bytes): PC1 MAC = 00:1A:2B:3C:4D:11
  - EtherType / Length (2 bytes): e.g., 0x0800 for IPv4
  - Payload (46–1500 bytes): contains the IP packet (IP header + transport + data)
  - Frame Check Sequence (FCS, 4 bytes): CRC32 for integrity

  Flow: IP packet (src IP, dst IP) -> encapsulated into Ethernet payload -> NIC attaches src/dst MACs -> frame transmitted.

- **How a PC sends to printer (same VLAN/subnet):**
  1. PC checks IP destination; sees it's local subnet.
  2. PC looks up printer IP in ARP cache. If missing, broadcasts ARP request.
  3. Printer replies with ARP response containing its MAC.
  4. PC constructs Ethernet frame with printer MAC as destination and sends.

- **Collision avoidance & handling**
  - **Wired Ethernet:**
    - Modern wired networks use switches and full-duplex links, so collisions do not occur because each link is a point-to-point full-duplex channel.
    - Historically, in shared medium (hubs / half-duplex), Ethernet used CSMA/CD: a station listens before transmit (carrier sense), transmits if idle, and if a collision is detected it sends a jam signal then waits a random exponential backoff before retry.
    - Practical recommendation: use switched full-duplex Ethernet to avoid collisions entirely.
  - **Wi‑Fi (Wireless):**
    - Wi‑Fi uses CSMA/CA (collision avoidance). A station listens; if medium idle for DIFS, it uses a randomized backoff before transmitting.
    - Because wireless cannot reliably detect collisions while transmitting (no omnidirectional collision detection), it relies on acknowledgments (ACK). If ACK is not received, the sender assumes failure and retries with exponential backoff.
    - Optional RTS/CTS handshake reduces hidden-node collisions: small RTS from sender, CTS from AP/station, then data frame.
    - Wi‑Fi also uses ACK frames and sequence numbers to ensure reliability.

**Part 2: IP Addressing & Subnetting**

- **Chosen private range:** 192.168.10.0/24

- **Subnetting choice:** split wired and wireless into two /25 subnets for logical separation (simple, easy to manage):
  - **Wired subnet:** 192.168.10.0/25 (network: .0, netmask 255.255.255.128) — usable hosts .1–.126
  - **Wireless subnet:** 192.168.10.128/25 (network: .128, netmask 255.255.255.128) — usable hosts .129–.254

- **IP assignments:**
  - **Router WAN (public) IP:** 203.0.113.10 (example public IP)
  - **Router LAN (wired) gateway:** 192.168.10.1 (/25)
  - **Router LAN (wireless) gateway / subinterface:** 192.168.10.129 (/25) — if router supports subinterfaces/VLANs
  - **Switch 1 (management, wired):** 192.168.10.2
  - **Switch 2 (management, wired):** 192.168.10.3
  - **PC1:** 192.168.10.10
  - **PC2:** 192.168.10.11
  - **PC3:** 192.168.10.12
  - **PC4:** 192.168.10.13
  - **Printer:** 192.168.10.20
  - **Access Point (management on wireless subnet):** 192.168.10.130
  - **Wireless Device A:** 192.168.10.140
  - **Wireless Device B:** 192.168.10.141

  - **Default gateway for wired devices:** 192.168.10.1
  - **Default gateway for wireless devices:** 192.168.10.129

- **Subnet rationale:** Two /25s provide isolation (policy, QoS, security) and are easy to configure; each side has plenty of addresses.

- **DHCP role:**
  - DHCP runs on the router (or a dedicated DHCP server). It provides dynamic IP assignment, subnet mask, default gateway, DNS servers, and other options.
  - Example DHCP pools:
    - Wired pool (192.168.10.10–192.168.10.100) with gateway 192.168.10.1
    - Wireless pool (192.168.10.140–192.168.10.200) with gateway 192.168.10.129
  - Devices can also use static IPs for servers/printers; DHCP reservations are recommended for devices that need stable addresses.

**Part 3: Routing & Packet Forwarding**

- **Scenario:** Wireless Device A (192.168.10.140) requests https://example.com (public IP 93.184.216.34).

- **End-to-end steps and link-layer actions:**
  1. **Application/Transport/IP creation:** Device A creates a TCP SYN to destination IP 93.184.216.34, source 192.168.10.140, source port random.
  2. **IP packet created:** IP header contains src=192.168.10.140, dst=93.184.216.34, TTL=64 (example), protocol=TCP.
  3. **Next-hop decision at host:** Packet's destination not in local subnet -> send to default gateway 192.168.10.129. Host ensures it knows gateway MAC via ARP on wireless subnet (ARP request/response to 192.168.10.129).
  4. **Frame encapsulation on wireless:** IP packet placed into 802.11 data frame with:
     - 802.11 header (addresses: RA/TA/SA/DA depending on AP mode), encrypted if WPA2/WPA3
     - Source MAC: Device A (00:1A:2B:3C:4D:A1)
     - Destination MAC: AP MAC (00:1A:2B:3C:4D:04)
  5. **AP forwards to switch/router:** AP strips 802.11 and forwards the encapsulated IP packet over its wired connection in an Ethernet frame with src AP MAC and dst router (or switch) MAC. If wireless and wired are in separate VLANs, AP tags VLAN accordingly.
  6. **Switch forwarding:** Ethernet switches use MAC tables to forward the frame towards the router interface (MAC lookup: find MAC for 192.168.10.129 interface).
  7. **Router receives frame:** Router removes Ethernet header, inspects IP header and routing table.

- **Router processing details:**
  - **IP header use by routers:** Router reads the destination IP (93.184.216.34) and uses its routing table to determine next hop (usually the ISP/default route). Router decrements TTL by 1 and recalculates IP checksum.
  - **Route selection / next hop:** Router matches destination against routing table entries (most-specific prefix wins). For external traffic, router likely has a default route (0.0.0.0/0) pointing to ISP gateway (e.g., 203.0.113.1). That next-hop is on the WAN interface. Router chooses that interface and next-hop IP.
  - **NAT role:** Before sending the packet out to the Internet, the router (performing Source NAT / PAT) rewrites the source IP from 192.168.10.140 to the router's public IP 203.0.113.10 and possibly rewrites the source port. The router records a NAT table entry mapping (public IP, public port) -> (internal IP, internal port).
  - **Encapsulation to ISP:** The router encapsulates the modified IP packet into the WAN link layer (e.g., Ethernet) with appropriate MAC addresses toward the ISP next hop and forwards.

- **Return path:**
  1. Remote web server replies to source 203.0.113.10. The reply is routed through the internet back to the router's public IP.
  2. Router looks up NAT table, finds mapping to 192.168.10.140:sourcePort, and rewrites destination back to the internal IP/port.
  3. Router forwards the packet onto the internal network toward the AP and finally to Device A using appropriate MAC addressing.

- **Additional considerations:**
  - **MTU and fragmentation:** Router may need to fragment or send ICMP Path MTU messages if packet too large.
  - **Firewall / ACLs:** Router may block/allow traffic per policy; NAT hides internal addresses from the internet.
  - **TTL and ICMP:** If TTL reaches 0 en route, an intermediate router will drop packet and send ICMP Time Exceeded back.

**Packet path summary (addresses and headers at each hop)**
- At Device A: IP(src=192.168.10.140,dst=93.184.216.34) inside 802.11 frame (SA=00:1A:2B:3C:4D:A1, DA=AP MAC)
- Over wired LAN: IP same, Ethernet(src=AP_MAC, dst=router_MAC)
- On router egress (WAN): IP(src=203.0.113.10,dst=93.184.216.34) after NAT, Ethernet(src=router_WAN_MAC, dst=ISP_MAC)

**Diagrams (logical)**
- Simple topology:

  Internet
     |
  [Router WAN (203.0.113.10)]
     |
  [Router LAN]---[Switch1]---PC1 (192.168.10.10)
                  |          PC2 (192.168.10.11)
                  |          Printer (192.168.10.20)
                  +---Switch2---PC3 (192.168.10.12)
                                PC4 (192.168.10.13)
                  +---AP (192.168.10.130)
                        /      \
             WirelessA(192.168.10.140)  WirelessB(192.168.10.141)

**Operational Recommendations**
- Use DHCP reservations for printers and AP management to avoid accidental IP changes.
- Enable WPA2/WPA3 on the AP and separate SSIDs per guest/employee networks if needed.
- Use the router firewall to restrict inbound connections; allow established/related traffic.
- Keep switches in managed mode if VLANs are required; otherwise unmanaged switches are fine for a flat wired VLAN.

**Files created**
- Full report: network_report.md

If you want this converted to a PowerPoint or PDF, I can generate a `presentation.pptx` or `network_report.pdf` next — which format do you prefer?