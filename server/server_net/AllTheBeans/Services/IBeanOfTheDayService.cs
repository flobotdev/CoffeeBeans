using AllTheBeans.Models;

namespace AllTheBeans.Services
{
    public interface IBeanOfTheDayService
    {
        Task<Bean?> GetBeanOfTheDayAsync();
        Task<Bean> SetBeanOfTheDayAsync(Guid beanId);
    }
}
