# DefaultApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**customersGet**](#customersget) | **GET** /customers | Get all customers|
|[**customersPost**](#customerspost) | **POST** /customers | Create a new customer|
|[**servicesGet**](#servicesget) | **GET** /services | Get all services|
|[**servicesIdIdGet**](#servicesididget) | **GET** /services/id/{id} | Get a specific service by its Id|
|[**servicesNameNameDelete**](#servicesnamenamedelete) | **DELETE** /services/name/{name} | Delete a service|
|[**servicesNameNameGet**](#servicesnamenameget) | **GET** /services/name/{name} | Get a specific service by its name|
|[**servicesPost**](#servicespost) | **POST** /services | Create a new service|
|[**ticketsGet**](#ticketsget) | **GET** /tickets | Get all tickets|
|[**ticketsPost**](#ticketspost) | **POST** /tickets | Create a new ticket|
|[**ticketsServiceServiceNameGet**](#ticketsserviceservicenameget) | **GET** /tickets/service/{service_name} | Get all the tickets by service name|
|[**ticketsTicketIdGet**](#ticketsticketidget) | **GET** /tickets/{ticket_id} | Get a specific ticket by its ID|

# **customersGet**
> Array<Customer> customersGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.customersGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Customer>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of customers |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersPost**
> Customer customersPost(customer)

Create a new customer with the provided details

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    Customer
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let customer: Customer; //

const { status, data } = await apiInstance.customersPost(
    customer
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customer** | **Customer**|  | |


### Return type

**Customer**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Customer created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **servicesGet**
> Array<Service> servicesGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.servicesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Service>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the services |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **servicesIdIdGet**
> Service servicesIdIdGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //The Id of the service to retrieve (default to undefined)

const { status, data } = await apiInstance.servicesIdIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | The Id of the service to retrieve | defaults to undefined|


### Return type

**Service**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A single service |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **servicesNameNameDelete**
> servicesNameNameDelete()

Delete a service by its name

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let name: string; //The name of the service to delete (default to undefined)

const { status, data } = await apiInstance.servicesNameNameDelete(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | The name of the service to delete | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Service deleted successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **servicesNameNameGet**
> Service servicesNameNameGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let name: string; //The name of the service to retrieve (default to undefined)

const { status, data } = await apiInstance.servicesNameNameGet(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | The name of the service to retrieve | defaults to undefined|


### Return type

**Service**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A single service |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **servicesPost**
> Service servicesPost(service)

Create a new service with the provided details

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    Service
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let service: Service; //

const { status, data } = await apiInstance.servicesPost(
    service
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **service** | **Service**|  | |


### Return type

**Service**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Service created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ticketsGet**
> Array<Ticket> ticketsGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.ticketsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Ticket>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of tickets |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ticketsPost**
> Ticket ticketsPost(ticket)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    Ticket
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let ticket: Ticket; //

const { status, data } = await apiInstance.ticketsPost(
    ticket
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ticket** | **Ticket**|  | |


### Return type

**Ticket**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Ticket created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ticketsServiceServiceNameGet**
> Array<Ticket> ticketsServiceServiceNameGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let serviceName: string; //The name of the service to filter tickets (default to undefined)

const { status, data } = await apiInstance.ticketsServiceServiceNameGet(
    serviceName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serviceName** | [**string**] | The name of the service to filter tickets | defaults to undefined|


### Return type

**Array<Ticket>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of tickets for the specified service |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ticketsTicketIdGet**
> Ticket ticketsTicketIdGet()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let ticketId: string; //The ID of the ticket to retrieve (default to undefined)

const { status, data } = await apiInstance.ticketsTicketIdGet(
    ticketId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ticketId** | [**string**] | The ID of the ticket to retrieve | defaults to undefined|


### Return type

**Ticket**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A single ticket |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

